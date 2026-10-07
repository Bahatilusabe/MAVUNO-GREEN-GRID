DECLARE
  v_cond VARCHAR2(4000);
BEGIN
  FOR c IN (SELECT constraint_name, search_condition
              FROM user_constraints
             WHERE table_name = 'USERS' AND constraint_type = 'C') LOOP
    v_cond := c.search_condition;
    IF UPPER(v_cond) LIKE '%ROLE IN (%' THEN
      EXECUTE IMMEDIATE 'ALTER TABLE users DROP CONSTRAINT "' || c.constraint_name || '"';
    END IF;
  END LOOP;
END;
/

ALTER TABLE users ADD CONSTRAINT users_role_chk CHECK (role IN ('farmer', 'partner', 'buyer', 'processor', 'storage_provider', 'transporter', 'recovery_partner', 'admin', 'analyst'));