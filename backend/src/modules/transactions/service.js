import oracledb from 'oracledb';
import { getClient } from '../../db/pool.js';
import { AppError } from '../../utils/errors.js';

// Define the strict paths a transaction can take
const validTransportTransitions = {
  'PENDING': ['ACCEPTED', 'CANCELLED'],
  'ACCEPTED': ['PLANNED'],
  'PLANNED': ['IN_TRANSIT'],
  'IN_TRANSIT': ['DELIVERED'],
  'DELIVERED': [],
  'CANCELLED': []
};

const validStorageTransitions = {
  'PENDING': ['CONFIRMED', 'CANCELLED'],
  'CONFIRMED': ['COMPLETED', 'CANCELLED'],
  'COMPLETED': [],
  'CANCELLED': []
};

export const updateStorageState = async (reservationId, newStatus) => {
  const connection = await getClient();
  
  try {
    // Lock the row to prevent concurrent modifications
    const result = await connection.execute(
      'SELECT status FROM storage_reservations WHERE id = :1 FOR UPDATE', 
      [reservationId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (!result.rows.length) {
      throw new AppError('Storage reservation not found', 404);
    }
    
    // Oracle returns column names in uppercase by default
    const currentStatus = result.rows[0].STATUS || result.rows[0].status;
    
    if (!validStorageTransitions[currentStatus].includes(newStatus)) {
      throw new AppError(`Invalid workflow transition: Cannot move from ${currentStatus} to ${newStatus}`, 400);
    }

    // Execute the state change
    await connection.execute(
      `UPDATE storage_reservations 
       SET status = :1, updated_at = SYSTIMESTAMP 
       WHERE id = :2`,
      [newStatus, reservationId]
    );

    await connection.commit();

    // Fetch and return the updated record
    const updated = await connection.execute(
      'SELECT * FROM storage_reservations WHERE id = :1',
      [reservationId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return updated.rows[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

export const updateTransportState = async (requestId, newStatus) => {
  const connection = await getClient();
  
  try {
    // Lock the row to prevent concurrent modifications
    const result = await connection.execute(
      'SELECT status FROM transport_requests WHERE id = :1 FOR UPDATE', 
      [requestId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (!result.rows.length) {
      throw new AppError('Transport request not found', 404);
    }
    
    const currentStatus = result.rows[0].STATUS || result.rows[0].status;
    
    // Validate the requested transition
    if (!validTransportTransitions[currentStatus].includes(newStatus)) {
      throw new AppError(`Invalid workflow transition: Cannot move from ${currentStatus} to ${newStatus}`, 400);
    }

    // Execute the state change
    await connection.execute(
      `UPDATE transport_requests 
       SET status = :1, updated_at = SYSTIMESTAMP 
       WHERE id = :2`,
      [newStatus, requestId]
    );

    await connection.commit();
    
    // Fetch and return the updated record
    const updated = await connection.execute(
      'SELECT * FROM transport_requests WHERE id = :1',
      [requestId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // NOTE: This is where we will trigger the Redis Event Pub/Sub for the Notification Engine
    // eventHub.emit('transaction:updated', updated.rows[0]);

    return updated.rows[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};