# MAVUNO-GREEN-GRID

MAVUNO Green Grid is a prototype agricultural platform with a React frontend and Python service modules for farm, market, and data workflows. The frontend currently uses local sample data; it is not wired to the Python modules or a live database.

## Run the Frontend

Requirements: Node.js and npm.

The Vite server prints the local URL. The app uses hash routes: `#/dashboard`, `#/farmer`, `#/admin`, and `#/partner`. Farmer subviews are available under `#/farmer/<view>`.

Useful frontend checks, from `frontend/`:

```powershell
npm run lint
npm run build
```

## Repository Status

- `frontend/`: Vite/React dashboards and portals backed by in-memory fixtures and local component state.
- `backend/`: Python API blueprint, JWT token helper, and service-class scaffolds. There is no backend application entry point or shared Python dependency manifest yet.
- `ai/`, `data/`, and `integrations/`: prototype model, pipeline, and provider modules; several methods are unimplemented placeholders.
- `database/`: SQL schema, migrations, seed, and view examples. The Python migration and seed helpers are incomplete; see their module READMEs before using them.
- `tests/`: currently contains a farm-service test scaffold; it does not yet assert service behavior.

See [docs/README.md](docs/README.md) for the component map and [frontend/README.md](frontend/README.md) for frontend routes and commands.

# MAVUNO-GREEN-GRID

```
MAVUNO-GREEN-GRID
├─ .venv
│  ├─ Include
│  ├─ Lib
│  │  └─ site-packages
│  │     ├─ annotated_doc
│  │     │  ├─ main.py
│  │     │  ├─ py.typed
│  │     │  └─ __init__.py
│  │     ├─ annotated_doc-0.0.5.dist-info
│  │     │  ├─ entry_points.txt
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  └─ WHEEL
│  │     ├─ annotated_types
│  │     │  ├─ py.typed
│  │     │  ├─ test_cases.py
│  │     │  └─ __init__.py
│  │     ├─ annotated_types-0.8.0.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  └─ WHEEL
│  │     ├─ anyio
│  │     │  ├─ abc
│  │     │  │  ├─ _eventloop.py
│  │     │  │  ├─ _resources.py
│  │     │  │  ├─ _sockets.py
│  │     │  │  ├─ _streams.py
│  │     │  │  ├─ _subprocesses.py
│  │     │  │  ├─ _tasks.py
│  │     │  │  ├─ _testing.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ from_thread.py
│  │     │  ├─ functools.py
│  │     │  ├─ itertools.py
│  │     │  ├─ lowlevel.py
│  │     │  ├─ py.typed
│  │     │  ├─ pytest_plugin.py
│  │     │  ├─ streams
│  │     │  │  ├─ buffered.py
│  │     │  │  ├─ file.py
│  │     │  │  ├─ memory.py
│  │     │  │  ├─ stapled.py
│  │     │  │  ├─ text.py
│  │     │  │  ├─ tls.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ to_interpreter.py
│  │     │  ├─ to_process.py
│  │     │  ├─ to_thread.py
│  │     │  ├─ _backends
│  │     │  │  ├─ _asyncio.py
│  │     │  │  ├─ _trio.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _core
│  │     │  │  ├─ _asyncio_selector_thread.py
│  │     │  │  ├─ _concurrency_utils.py
│  │     │  │  ├─ _contextmanagers.py
│  │     │  │  ├─ _eventloop.py
│  │     │  │  ├─ _exceptions.py
│  │     │  │  ├─ _fileio.py
│  │     │  │  ├─ _futures.py
│  │     │  │  ├─ _resources.py
│  │     │  │  ├─ _signals.py
│  │     │  │  ├─ _sockets.py
│  │     │  │  ├─ _streams.py
│  │     │  │  ├─ _subprocesses.py
│  │     │  │  ├─ _synchronization.py
│  │     │  │  ├─ _tasks.py
│  │     │  │  ├─ _tempfile.py
│  │     │  │  ├─ _testing.py
│  │     │  │  ├─ _typedattr.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _lazyimport.py
│  │     │  └─ __init__.py
│  │     ├─ anyio-4.15.1.dist-info
│  │     │  ├─ entry_points.txt
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ top_level.txt
│  │     │  └─ WHEEL
│  │     ├─ cffi
│  │     │  ├─ api.py
│  │     │  ├─ backend_ctypes.py
│  │     │  ├─ cffi_opcode.py
│  │     │  ├─ commontypes.py
│  │     │  ├─ cparser.py
│  │     │  ├─ error.py
│  │     │  ├─ ffiplatform.py
│  │     │  ├─ gen_src.py
│  │     │  ├─ lock.py
│  │     │  ├─ model.py
│  │     │  ├─ parse_c_type.h
│  │     │  ├─ pkgconfig.py
│  │     │  ├─ recompiler.py
│  │     │  ├─ setuptools_ext.py
│  │     │  ├─ vengine_cpy.py
│  │     │  ├─ vengine_gen.py
│  │     │  ├─ verifier.py
│  │     │  ├─ _cffi_errors.h
│  │     │  ├─ _cffi_gen_src.py
│  │     │  ├─ _cffi_include.h
│  │     │  ├─ _embedding.h
│  │     │  ├─ _imp_emulation.py
│  │     │  ├─ _shimmed_dist_utils.py
│  │     │  └─ __init__.py
│  │     ├─ cffi-2.1.1.dist-info
│  │     │  ├─ entry_points.txt
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ top_level.txt
│  │     │  └─ WHEEL
│  │     ├─ click
│  │     │  ├─ core.py
│  │     │  ├─ decorators.py
│  │     │  ├─ exceptions.py
│  │     │  ├─ formatting.py
│  │     │  ├─ globals.py
│  │     │  ├─ parser.py
│  │     │  ├─ py.typed
│  │     │  ├─ shell_completion.py
│  │     │  ├─ termui.py
│  │     │  ├─ testing.py
│  │     │  ├─ types.py
│  │     │  ├─ utils.py
│  │     │  ├─ _compat.py
│  │     │  ├─ _termui_impl.py
│  │     │  ├─ _textwrap.py
│  │     │  ├─ _utils.py
│  │     │  ├─ _winconsole.py
│  │     │  └─ __init__.py
│  │     ├─ click-8.5.0.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE.txt
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  └─ WHEEL
│  │     ├─ cryptography
│  │     │  ├─ cobblestone.py
│  │     │  ├─ exceptions.py
│  │     │  ├─ fernet.py
│  │     │  ├─ hazmat
│  │     │  │  ├─ asn1
│  │     │  │  │  ├─ asn1.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ backends
│  │     │  │  │  ├─ openssl
│  │     │  │  │  │  ├─ backend.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ bindings
│  │     │  │  │  ├─ openssl
│  │     │  │  │  │  ├─ binding.py
│  │     │  │  │  │  ├─ _conditional.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ _rust
│  │     │  │  │  │  ├─ asn1.pyi
│  │     │  │  │  │  ├─ cobblestone.pyi
│  │     │  │  │  │  ├─ declarative_asn1.pyi
│  │     │  │  │  │  ├─ exceptions.pyi
│  │     │  │  │  │  ├─ ocsp.pyi
│  │     │  │  │  │  ├─ openssl
│  │     │  │  │  │  │  ├─ aead.pyi
│  │     │  │  │  │  │  ├─ ciphers.pyi
│  │     │  │  │  │  │  ├─ cmac.pyi
│  │     │  │  │  │  │  ├─ dh.pyi
│  │     │  │  │  │  │  ├─ dsa.pyi
│  │     │  │  │  │  │  ├─ ec.pyi
│  │     │  │  │  │  │  ├─ ed25519.pyi
│  │     │  │  │  │  │  ├─ ed448.pyi
│  │     │  │  │  │  │  ├─ hashes.pyi
│  │     │  │  │  │  │  ├─ hmac.pyi
│  │     │  │  │  │  │  ├─ hpke.pyi
│  │     │  │  │  │  │  ├─ kdf.pyi
│  │     │  │  │  │  │  ├─ keys.pyi
│  │     │  │  │  │  │  ├─ keywrap.pyi
│  │     │  │  │  │  │  ├─ mldsa.pyi
│  │     │  │  │  │  │  ├─ mlkem.pyi
│  │     │  │  │  │  │  ├─ poly1305.pyi
│  │     │  │  │  │  │  ├─ rsa.pyi
│  │     │  │  │  │  │  ├─ x25519.pyi
│  │     │  │  │  │  │  ├─ x448.pyi
│  │     │  │  │  │  │  └─ __init__.pyi
│  │     │  │  │  │  ├─ pkcs12.pyi
│  │     │  │  │  │  ├─ pkcs7.pyi
│  │     │  │  │  │  ├─ test_support.pyi
│  │     │  │  │  │  ├─ x509.pyi
│  │     │  │  │  │  ├─ _openssl.pyi
│  │     │  │  │  │  └─ __init__.pyi
│  │     │  │  │  ├─ _rust.pyd
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ decrepit
│  │     │  │  │  ├─ ciphers
│  │     │  │  │  │  ├─ algorithms.py
│  │     │  │  │  │  ├─ modes.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ primitives
│  │     │  │  │  ├─ asymmetric
│  │     │  │  │  │  ├─ dh.py
│  │     │  │  │  │  ├─ dsa.py
│  │     │  │  │  │  ├─ ec.py
│  │     │  │  │  │  ├─ ed25519.py
│  │     │  │  │  │  ├─ ed448.py
│  │     │  │  │  │  ├─ mldsa.py
│  │     │  │  │  │  ├─ mlkem.py
│  │     │  │  │  │  ├─ padding.py
│  │     │  │  │  │  ├─ rsa.py
│  │     │  │  │  │  ├─ types.py
│  │     │  │  │  │  ├─ utils.py
│  │     │  │  │  │  ├─ x25519.py
│  │     │  │  │  │  ├─ x448.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ ciphers
│  │     │  │  │  │  ├─ aead.py
│  │     │  │  │  │  ├─ algorithms.py
│  │     │  │  │  │  ├─ base.py
│  │     │  │  │  │  ├─ modes.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ cmac.py
│  │     │  │  │  ├─ constant_time.py
│  │     │  │  │  ├─ hashes.py
│  │     │  │  │  ├─ hmac.py
│  │     │  │  │  ├─ hpke.py
│  │     │  │  │  ├─ kdf
│  │     │  │  │  │  ├─ argon2.py
│  │     │  │  │  │  ├─ concatkdf.py
│  │     │  │  │  │  ├─ hkdf.py
│  │     │  │  │  │  ├─ kbkdf.py
│  │     │  │  │  │  ├─ pbkdf2.py
│  │     │  │  │  │  ├─ scrypt.py
│  │     │  │  │  │  ├─ x963kdf.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ keywrap.py
│  │     │  │  │  ├─ padding.py
│  │     │  │  │  ├─ poly1305.py
│  │     │  │  │  ├─ serialization
│  │     │  │  │  │  ├─ base.py
│  │     │  │  │  │  ├─ pkcs12.py
│  │     │  │  │  │  ├─ pkcs7.py
│  │     │  │  │  │  ├─ ssh.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ twofactor
│  │     │  │  │  │  ├─ hotp.py
│  │     │  │  │  │  ├─ totp.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ _asymmetric.py
│  │     │  │  │  ├─ _cipheralgorithm.py
│  │     │  │  │  ├─ _modes.py
│  │     │  │  │  ├─ _serialization.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ _oid.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ py.typed
│  │     │  ├─ utils.py
│  │     │  ├─ x509
│  │     │  │  ├─ base.py
│  │     │  │  ├─ certificate_transparency.py
│  │     │  │  ├─ extensions.py
│  │     │  │  ├─ general_name.py
│  │     │  │  ├─ name.py
│  │     │  │  ├─ ocsp.py
│  │     │  │  ├─ oid.py
│  │     │  │  ├─ verification.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ __about__.py
│  │     │  └─ __init__.py
│  │     ├─ cryptography-50.0.2.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  ├─ LICENSE
│  │     │  │  ├─ LICENSE.APACHE
│  │     │  │  └─ LICENSE.BSD
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ sboms
│  │     │  │  ├─ cryptography-rust.cyclonedx.json
│  │     │  │  └─ sbom.json
│  │     │  └─ WHEEL
│  │     ├─ dateutil
│  │     │  ├─ easter.py
│  │     │  ├─ parser
│  │     │  │  ├─ isoparser.py
│  │     │  │  ├─ _parser.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ relativedelta.py
│  │     │  ├─ rrule.py
│  │     │  ├─ tz
│  │     │  │  ├─ tz.py
│  │     │  │  ├─ win.py
│  │     │  │  ├─ _common.py
│  │     │  │  ├─ _factories.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ tzwin.py
│  │     │  ├─ utils.py
│  │     │  ├─ zoneinfo
│  │     │  │  ├─ dateutil-zoneinfo.tar.gz
│  │     │  │  ├─ rebuild.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _common.py
│  │     │  ├─ _version.py
│  │     │  └─ __init__.py
│  │     ├─ dotenv
│  │     │  ├─ cli.py
│  │     │  ├─ ipython.py
│  │     │  ├─ main.py
│  │     │  ├─ parser.py
│  │     │  ├─ py.typed
│  │     │  ├─ variables.py
│  │     │  ├─ version.py
│  │     │  ├─ __init__.py
│  │     │  └─ __main__.py
│  │     ├─ fastapi
│  │     │  ├─ .agents
│  │     │  │  └─ skills
│  │     │  │     └─ fastapi
│  │     │  │        ├─ references
│  │     │  │        │  ├─ dependencies.md
│  │     │  │        │  ├─ other-tools.md
│  │     │  │        │  ├─ path-operations.md
│  │     │  │        │  ├─ pydantic.md
│  │     │  │        │  ├─ responses.md
│  │     │  │        │  └─ streaming.md
│  │     │  │        └─ SKILL.md
│  │     │  ├─ applications.py
│  │     │  ├─ background.py
│  │     │  ├─ cli.py
│  │     │  ├─ concurrency.py
│  │     │  ├─ datastructures.py
│  │     │  ├─ dependencies
│  │     │  │  ├─ models.py
│  │     │  │  ├─ utils.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ encoders.py
│  │     │  ├─ exceptions.py
│  │     │  ├─ exception_handlers.py
│  │     │  ├─ logger.py
│  │     │  ├─ middleware
│  │     │  │  ├─ asyncexitstack.py
│  │     │  │  ├─ cors.py
│  │     │  │  ├─ gzip.py
│  │     │  │  ├─ httpsredirect.py
│  │     │  │  ├─ trustedhost.py
│  │     │  │  ├─ wsgi.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ openapi
│  │     │  │  ├─ constants.py
│  │     │  │  ├─ docs.py
│  │     │  │  ├─ models.py
│  │     │  │  ├─ utils.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ params.py
│  │     │  ├─ param_functions.py
│  │     │  ├─ py.typed
│  │     │  ├─ requests.py
│  │     │  ├─ responses.py
│  │     │  ├─ routing.py
│  │     │  ├─ security
│  │     │  │  ├─ api_key.py
│  │     │  │  ├─ base.py
│  │     │  │  ├─ http.py
│  │     │  │  ├─ oauth2.py
│  │     │  │  ├─ open_id_connect_url.py
│  │     │  │  ├─ utils.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ sse.py
│  │     │  ├─ staticfiles.py
│  │     │  ├─ telemetry
│  │     │  │  ├─ _api.py
│  │     │  │  ├─ _asgi.py
│  │     │  │  ├─ _runtime.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ templating.py
│  │     │  ├─ testclient.py
│  │     │  ├─ types.py
│  │     │  ├─ utils.py
│  │     │  ├─ websockets.py
│  │     │  ├─ _compat
│  │     │  │  ├─ shared.py
│  │     │  │  ├─ v2.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ __init__.py
│  │     │  └─ __main__.py
│  │     ├─ fastapi-0.142.2.dist-info
│  │     │  ├─ entry_points.txt
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ REQUESTED
│  │     │  └─ WHEEL
│  │     ├─ h11
│  │     │  ├─ py.typed
│  │     │  ├─ _abnf.py
│  │     │  ├─ _connection.py
│  │     │  ├─ _events.py
│  │     │  ├─ _headers.py
│  │     │  ├─ _readers.py
│  │     │  ├─ _receivebuffer.py
│  │     │  ├─ _state.py
│  │     │  ├─ _util.py
│  │     │  ├─ _version.py
│  │     │  ├─ _writers.py
│  │     │  └─ __init__.py
│  │     ├─ h11-0.16.0.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE.txt
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ top_level.txt
│  │     │  └─ WHEEL
│  │     ├─ httpcore2
│  │     │  ├─ py.typed
│  │     │  ├─ _api.py
│  │     │  ├─ _async
│  │     │  │  ├─ connection.py
│  │     │  │  ├─ connection_pool.py
│  │     │  │  ├─ http11.py
│  │     │  │  ├─ http2.py
│  │     │  │  ├─ http_proxy.py
│  │     │  │  ├─ interfaces.py
│  │     │  │  ├─ socks_proxy.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _backends
│  │     │  │  ├─ anyio.py
│  │     │  │  ├─ auto.py
│  │     │  │  ├─ base.py
│  │     │  │  ├─ mock.py
│  │     │  │  ├─ sync.py
│  │     │  │  ├─ trio.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _exceptions.py
│  │     │  ├─ _models.py
│  │     │  ├─ _ssl.py
│  │     │  ├─ _sync
│  │     │  │  ├─ connection.py
│  │     │  │  ├─ connection_pool.py
│  │     │  │  ├─ http11.py
│  │     │  │  ├─ http2.py
│  │     │  │  ├─ http_proxy.py
│  │     │  │  ├─ interfaces.py
│  │     │  │  ├─ socks_proxy.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _synchronization.py
│  │     │  ├─ _trace.py
│  │     │  ├─ _utils.py
│  │     │  └─ __init__.py
│  │     ├─ httpcore2-2.13.1.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE.md
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  └─ WHEEL
│  │     ├─ httpx2
│  │     │  ├─ py.typed
│  │     │  ├─ websockets
│  │     │  │  ├─ _api.py
│  │     │  │  ├─ _exceptions.py
│  │     │  │  ├─ _ping.py
│  │     │  │  ├─ _transport.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _alias.py
│  │     │  ├─ _api.py
│  │     │  ├─ _auth.py
│  │     │  ├─ _client.py
│  │     │  ├─ _config.py
│  │     │  ├─ _content.py
│  │     │  ├─ _decoders.py
│  │     │  ├─ _exceptions.py
│  │     │  ├─ _main.py
│  │     │  ├─ _models.py
│  │     │  ├─ _multipart.py
│  │     │  ├─ _sse.py
│  │     │  ├─ _status_codes.py
│  │     │  ├─ _transports
│  │     │  │  ├─ asgi.py
│  │     │  │  ├─ base.py
│  │     │  │  ├─ default.py
│  │     │  │  ├─ mock.py
│  │     │  │  ├─ wsgi.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _types.py
│  │     │  ├─ _urlparse.py
│  │     │  ├─ _urls.py
│  │     │  ├─ _utils.py
│  │     │  ├─ __init__.py
│  │     │  └─ __version__.py
│  │     ├─ httpx2-2.13.1.dist-info
│  │     │  ├─ entry_points.txt
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE.md
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  └─ WHEEL
│  │     ├─ idna
│  │     │  ├─ cli.py
│  │     │  ├─ codec.py
│  │     │  ├─ compat.py
│  │     │  ├─ core.py
│  │     │  ├─ idnadata.py
│  │     │  ├─ intranges.py
│  │     │  ├─ package_data.py
│  │     │  ├─ py.typed
│  │     │  ├─ uts46data.py
│  │     │  ├─ __init__.py
│  │     │  └─ __main__.py
│  │     ├─ idna-3.20.dist-info
│  │     │  ├─ entry_points.txt
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE.md
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  └─ WHEEL
│  │     ├─ jiter
│  │     │  ├─ jiter.cp314-win_amd64.pyd
│  │     │  ├─ py.typed
│  │     │  ├─ __init__.py
│  │     │  └─ __init__.pyi
│  │     ├─ jiter-0.17.0.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ sboms
│  │     │  │  └─ jiter-python.cyclonedx.json
│  │     │  └─ WHEEL
│  │     ├─ json_repair
│  │     │  ├─ json_parser.py
│  │     │  ├─ json_repair.py
│  │     │  ├─ parser_parenthesized.py
│  │     │  ├─ parser_schema.py
│  │     │  ├─ parse_array.py
│  │     │  ├─ parse_comment.py
│  │     │  ├─ parse_number.py
│  │     │  ├─ parse_object.py
│  │     │  ├─ parse_string.py
│  │     │  ├─ parse_string_helpers
│  │     │  │  ├─ object_value_context.py
│  │     │  │  ├─ parse_boolean_or_null.py
│  │     │  │  ├─ parse_json_llm_block.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ py.typed
│  │     │  ├─ schema_repair.py
│  │     │  ├─ utils
│  │     │  │  ├─ constants.py
│  │     │  │  ├─ json_context.py
│  │     │  │  ├─ object_comparer.py
│  │     │  │  ├─ pattern_properties.py
│  │     │  │  ├─ string_file_wrapper.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ __init__.py
│  │     │  └─ __main__.py
│  │     ├─ json_repair-0.63.5.dist-info
│  │     │  ├─ entry_points.txt
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ REQUESTED
│  │     │  ├─ top_level.txt
│  │     │  └─ WHEEL
│  │     ├─ numpy
│  │     │  ├─ char
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ conftest.py
│  │     │  ├─ core
│  │     │  │  ├─ arrayprint.py
│  │     │  │  ├─ arrayprint.pyi
│  │     │  │  ├─ defchararray.py
│  │     │  │  ├─ defchararray.pyi
│  │     │  │  ├─ einsumfunc.py
│  │     │  │  ├─ einsumfunc.pyi
│  │     │  │  ├─ fromnumeric.py
│  │     │  │  ├─ fromnumeric.pyi
│  │     │  │  ├─ function_base.py
│  │     │  │  ├─ function_base.pyi
│  │     │  │  ├─ getlimits.py
│  │     │  │  ├─ getlimits.pyi
│  │     │  │  ├─ multiarray.py
│  │     │  │  ├─ multiarray.pyi
│  │     │  │  ├─ numeric.py
│  │     │  │  ├─ numeric.pyi
│  │     │  │  ├─ numerictypes.py
│  │     │  │  ├─ numerictypes.pyi
│  │     │  │  ├─ overrides.py
│  │     │  │  ├─ overrides.pyi
│  │     │  │  ├─ records.py
│  │     │  │  ├─ records.pyi
│  │     │  │  ├─ shape_base.py
│  │     │  │  ├─ shape_base.pyi
│  │     │  │  ├─ umath.py
│  │     │  │  ├─ umath.pyi
│  │     │  │  ├─ _dtype.py
│  │     │  │  ├─ _dtype.pyi
│  │     │  │  ├─ _dtype_ctypes.py
│  │     │  │  ├─ _dtype_ctypes.pyi
│  │     │  │  ├─ _internal.py
│  │     │  │  ├─ _internal.pyi
│  │     │  │  ├─ _multiarray_umath.py
│  │     │  │  ├─ _utils.py
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ ctypeslib
│  │     │  │  ├─ _ctypeslib.py
│  │     │  │  ├─ _ctypeslib.pyi
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ doc
│  │     │  │  └─ ufuncs.py
│  │     │  ├─ dtypes.py
│  │     │  ├─ dtypes.pyi
│  │     │  ├─ exceptions.py
│  │     │  ├─ exceptions.pyi
│  │     │  ├─ f2py
│  │     │  │  ├─ auxfuncs.py
│  │     │  │  ├─ auxfuncs.pyi
│  │     │  │  ├─ capi_maps.py
│  │     │  │  ├─ capi_maps.pyi
│  │     │  │  ├─ cb_rules.py
│  │     │  │  ├─ cb_rules.pyi
│  │     │  │  ├─ cfuncs.py
│  │     │  │  ├─ cfuncs.pyi
│  │     │  │  ├─ common_rules.py
│  │     │  │  ├─ common_rules.pyi
│  │     │  │  ├─ crackfortran.py
│  │     │  │  ├─ crackfortran.pyi
│  │     │  │  ├─ diagnose.py
│  │     │  │  ├─ diagnose.pyi
│  │     │  │  ├─ f2py2e.py
│  │     │  │  ├─ f2py2e.pyi
│  │     │  │  ├─ f90mod_rules.py
│  │     │  │  ├─ f90mod_rules.pyi
│  │     │  │  ├─ func2subr.py
│  │     │  │  ├─ func2subr.pyi
│  │     │  │  ├─ rules.py
│  │     │  │  ├─ rules.pyi
│  │     │  │  ├─ setup.cfg
│  │     │  │  ├─ src
│  │     │  │  │  ├─ fortranobject.c
│  │     │  │  │  └─ fortranobject.h
│  │     │  │  ├─ symbolic.py
│  │     │  │  ├─ symbolic.pyi
│  │     │  │  ├─ tests
│  │     │  │  │  ├─ src
│  │     │  │  │  │  ├─ abstract_interface
│  │     │  │  │  │  │  ├─ foo.f90
│  │     │  │  │  │  │  └─ gh18403_mod.f90
│  │     │  │  │  │  ├─ array_from_pyobj
│  │     │  │  │  │  │  └─ wrapmodule.c
│  │     │  │  │  │  ├─ assumed_shape
│  │     │  │  │  │  │  ├─ .f2py_f2cmap
│  │     │  │  │  │  │  ├─ foo_free.f90
│  │     │  │  │  │  │  ├─ foo_mod.f90
│  │     │  │  │  │  │  ├─ foo_use.f90
│  │     │  │  │  │  │  └─ precision.f90
│  │     │  │  │  │  ├─ block_docstring
│  │     │  │  │  │  │  └─ foo.f
│  │     │  │  │  │  ├─ callback
│  │     │  │  │  │  │  ├─ foo.f
│  │     │  │  │  │  │  ├─ gh17797.f90
│  │     │  │  │  │  │  ├─ gh18335.f90
│  │     │  │  │  │  │  ├─ gh25211.f
│  │     │  │  │  │  │  ├─ gh25211.pyf
│  │     │  │  │  │  │  └─ gh26681.f90
│  │     │  │  │  │  ├─ cli
│  │     │  │  │  │  │  ├─ gh_22819.pyf
│  │     │  │  │  │  │  ├─ hi77.f
│  │     │  │  │  │  │  └─ hiworld.f90
│  │     │  │  │  │  ├─ common
│  │     │  │  │  │  │  ├─ block.f
│  │     │  │  │  │  │  └─ gh19161.f90
│  │     │  │  │  │  ├─ crackfortran
│  │     │  │  │  │  │  ├─ accesstype.f90
│  │     │  │  │  │  │  ├─ common_with_division.f
│  │     │  │  │  │  │  ├─ data_common.f
│  │     │  │  │  │  │  ├─ data_multiplier.f
│  │     │  │  │  │  │  ├─ data_stmts.f90
│  │     │  │  │  │  │  ├─ data_with_comments.f
│  │     │  │  │  │  │  ├─ foo_deps.f90
│  │     │  │  │  │  │  ├─ gh15035.f
│  │     │  │  │  │  │  ├─ gh17859.f
│  │     │  │  │  │  │  ├─ gh22648.pyf
│  │     │  │  │  │  │  ├─ gh23533.f
│  │     │  │  │  │  │  ├─ gh23598.f90
│  │     │  │  │  │  │  ├─ gh23598Warn.f90
│  │     │  │  │  │  │  ├─ gh23879.f90
│  │     │  │  │  │  │  ├─ gh27697.f90
│  │     │  │  │  │  │  ├─ gh2848.f90
│  │     │  │  │  │  │  ├─ operators.f90
│  │     │  │  │  │  │  ├─ privatemod.f90
│  │     │  │  │  │  │  ├─ publicmod.f90
│  │     │  │  │  │  │  ├─ pubprivmod.f90
│  │     │  │  │  │  │  └─ unicode_comment.f90
│  │     │  │  │  │  ├─ f2cmap
│  │     │  │  │  │  │  ├─ .f2py_f2cmap
│  │     │  │  │  │  │  └─ isoFortranEnvMap.f90
│  │     │  │  │  │  ├─ inplace
│  │     │  │  │  │  │  └─ foo.f
│  │     │  │  │  │  ├─ isocintrin
│  │     │  │  │  │  │  └─ isoCtests.f90
│  │     │  │  │  │  ├─ kind
│  │     │  │  │  │  │  └─ foo.f90
│  │     │  │  │  │  ├─ mixed
│  │     │  │  │  │  │  ├─ foo.f
│  │     │  │  │  │  │  ├─ foo_fixed.f90
│  │     │  │  │  │  │  └─ foo_free.f90
│  │     │  │  │  │  ├─ modules
│  │     │  │  │  │  │  ├─ gh25337
│  │     │  │  │  │  │  │  ├─ data.f90
│  │     │  │  │  │  │  │  └─ use_data.f90
│  │     │  │  │  │  │  ├─ gh26920
│  │     │  │  │  │  │  │  ├─ two_mods_with_no_public_entities.f90
│  │     │  │  │  │  │  │  └─ two_mods_with_one_public_routine.f90
│  │     │  │  │  │  │  ├─ module_data_docstring.f90
│  │     │  │  │  │  │  └─ use_modules.f90
│  │     │  │  │  │  ├─ negative_bounds
│  │     │  │  │  │  │  └─ issue_20853.f90
│  │     │  │  │  │  ├─ parameter
│  │     │  │  │  │  │  ├─ constant_array.f90
│  │     │  │  │  │  │  ├─ constant_both.f90
│  │     │  │  │  │  │  ├─ constant_compound.f90
│  │     │  │  │  │  │  ├─ constant_integer.f90
│  │     │  │  │  │  │  ├─ constant_non_compound.f90
│  │     │  │  │  │  │  └─ constant_real.f90
│  │     │  │  │  │  ├─ quoted_character
│  │     │  │  │  │  │  └─ foo.f
│  │     │  │  │  │  ├─ regression
│  │     │  │  │  │  │  ├─ AB.inc
│  │     │  │  │  │  │  ├─ assignOnlyModule.f90
│  │     │  │  │  │  │  ├─ complex_struct_compat.f90
│  │     │  │  │  │  │  ├─ complex_struct_compat.pyf
│  │     │  │  │  │  │  ├─ datonly.f90
│  │     │  │  │  │  │  ├─ f77comments.f
│  │     │  │  │  │  │  ├─ f77fixedform.f95
│  │     │  │  │  │  │  ├─ f90continuation.f90
│  │     │  │  │  │  │  ├─ incfile.f90
│  │     │  │  │  │  │  ├─ inout.f90
│  │     │  │  │  │  │  ├─ lower_f2py_fortran.f90
│  │     │  │  │  │  │  └─ mod_derived_types.f90
│  │     │  │  │  │  ├─ return_character
│  │     │  │  │  │  │  ├─ foo77.f
│  │     │  │  │  │  │  └─ foo90.f90
│  │     │  │  │  │  ├─ return_complex
│  │     │  │  │  │  │  ├─ foo77.f
│  │     │  │  │  │  │  └─ foo90.f90
│  │     │  │  │  │  ├─ return_integer
│  │     │  │  │  │  │  ├─ foo77.f
│  │     │  │  │  │  │  └─ foo90.f90
│  │     │  │  │  │  ├─ return_logical
│  │     │  │  │  │  │  ├─ foo77.f
│  │     │  │  │  │  │  └─ foo90.f90
│  │     │  │  │  │  ├─ return_real
│  │     │  │  │  │  │  ├─ foo77.f
│  │     │  │  │  │  │  └─ foo90.f90
│  │     │  │  │  │  ├─ routines
│  │     │  │  │  │  │  ├─ funcfortranname.f
│  │     │  │  │  │  │  ├─ funcfortranname.pyf
│  │     │  │  │  │  │  ├─ subrout.f
│  │     │  │  │  │  │  └─ subrout.pyf
│  │     │  │  │  │  ├─ size
│  │     │  │  │  │  │  └─ foo.f90
│  │     │  │  │  │  ├─ string
│  │     │  │  │  │  │  ├─ char.f90
│  │     │  │  │  │  │  ├─ fixed_string.f90
│  │     │  │  │  │  │  ├─ gh24008.f
│  │     │  │  │  │  │  ├─ gh24662.f90
│  │     │  │  │  │  │  ├─ gh25286.f90
│  │     │  │  │  │  │  ├─ gh25286.pyf
│  │     │  │  │  │  │  ├─ gh25286_bc.pyf
│  │     │  │  │  │  │  ├─ scalar_string.f90
│  │     │  │  │  │  │  └─ string.f
│  │     │  │  │  │  └─ value_attrspec
│  │     │  │  │  │     └─ gh21665.f90
│  │     │  │  │  ├─ test_abstract_interface.py
│  │     │  │  │  ├─ test_array_from_pyobj.py
│  │     │  │  │  ├─ test_assumed_shape.py
│  │     │  │  │  ├─ test_block_docstring.py
│  │     │  │  │  ├─ test_callback.py
│  │     │  │  │  ├─ test_capi_maps.py
│  │     │  │  │  ├─ test_character.py
│  │     │  │  │  ├─ test_common.py
│  │     │  │  │  ├─ test_crackfortran.py
│  │     │  │  │  ├─ test_data.py
│  │     │  │  │  ├─ test_docs.py
│  │     │  │  │  ├─ test_f2cmap.py
│  │     │  │  │  ├─ test_f2py2e.py
│  │     │  │  │  ├─ test_inplace.py
│  │     │  │  │  ├─ test_isoc.py
│  │     │  │  │  ├─ test_kind.py
│  │     │  │  │  ├─ test_mixed.py
│  │     │  │  │  ├─ test_modules.py
│  │     │  │  │  ├─ test_parameter.py
│  │     │  │  │  ├─ test_pyf_src.py
│  │     │  │  │  ├─ test_quoted_character.py
│  │     │  │  │  ├─ test_regression.py
│  │     │  │  │  ├─ test_return_character.py
│  │     │  │  │  ├─ test_return_complex.py
│  │     │  │  │  ├─ test_return_integer.py
│  │     │  │  │  ├─ test_return_logical.py
│  │     │  │  │  ├─ test_return_real.py
│  │     │  │  │  ├─ test_routines.py
│  │     │  │  │  ├─ test_semicolon_split.py
│  │     │  │  │  ├─ test_size.py
│  │     │  │  │  ├─ test_string.py
│  │     │  │  │  ├─ test_symbolic.py
│  │     │  │  │  ├─ test_value_attrspec.py
│  │     │  │  │  ├─ util.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ use_rules.py
│  │     │  │  ├─ use_rules.pyi
│  │     │  │  ├─ _backends
│  │     │  │  │  ├─ meson.build.template
│  │     │  │  │  ├─ _backend.py
│  │     │  │  │  ├─ _backend.pyi
│  │     │  │  │  ├─ _meson.py
│  │     │  │  │  ├─ _meson.pyi
│  │     │  │  │  ├─ __init__.py
│  │     │  │  │  └─ __init__.pyi
│  │     │  │  ├─ _isocbind.py
│  │     │  │  ├─ _isocbind.pyi
│  │     │  │  ├─ _src_pyf.py
│  │     │  │  ├─ _src_pyf.pyi
│  │     │  │  ├─ __init__.py
│  │     │  │  ├─ __init__.pyi
│  │     │  │  ├─ __main__.py
│  │     │  │  ├─ __version__.py
│  │     │  │  └─ __version__.pyi
│  │     │  ├─ fft
│  │     │  │  ├─ tests
│  │     │  │  │  ├─ test_helper.py
│  │     │  │  │  ├─ test_pocketfft.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ _helper.py
│  │     │  │  ├─ _helper.pyi
│  │     │  │  ├─ _pocketfft.py
│  │     │  │  ├─ _pocketfft.pyi
│  │     │  │  ├─ _pocketfft_umath.cp314-win_amd64.lib
│  │     │  │  ├─ _pocketfft_umath.cp314-win_amd64.pyd
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ lib
│  │     │  │  ├─ array_utils.py
│  │     │  │  ├─ array_utils.pyi
│  │     │  │  ├─ format.py
│  │     │  │  ├─ format.pyi
│  │     │  │  ├─ introspect.py
│  │     │  │  ├─ introspect.pyi
│  │     │  │  ├─ mixins.py
│  │     │  │  ├─ mixins.pyi
│  │     │  │  ├─ npyio.py
│  │     │  │  ├─ npyio.pyi
│  │     │  │  ├─ recfunctions.py
│  │     │  │  ├─ recfunctions.pyi
│  │     │  │  ├─ scimath.py
│  │     │  │  ├─ scimath.pyi
│  │     │  │  ├─ stride_tricks.py
│  │     │  │  ├─ stride_tricks.pyi
│  │     │  │  ├─ tests
│  │     │  │  │  ├─ data
│  │     │  │  │  │  ├─ py2-np0-objarr.npy
│  │     │  │  │  │  ├─ py2-objarr.npy
│  │     │  │  │  │  ├─ py2-objarr.npz
│  │     │  │  │  │  ├─ py3-objarr.npy
│  │     │  │  │  │  ├─ py3-objarr.npz
│  │     │  │  │  │  ├─ python3.npy
│  │     │  │  │  │  └─ win64python2.npy
│  │     │  │  │  ├─ test_arraypad.py
│  │     │  │  │  ├─ test_arraysetops.py
│  │     │  │  │  ├─ test_arrayterator.py
│  │     │  │  │  ├─ test_array_utils.py
│  │     │  │  │  ├─ test_format.py
│  │     │  │  │  ├─ test_function_base.py
│  │     │  │  │  ├─ test_histograms.py
│  │     │  │  │  ├─ test_index_tricks.py
│  │     │  │  │  ├─ test_io.py
│  │     │  │  │  ├─ test_loadtxt.py
│  │     │  │  │  ├─ test_mixins.py
│  │     │  │  │  ├─ test_nanfunctions.py
│  │     │  │  │  ├─ test_packbits.py
│  │     │  │  │  ├─ test_polynomial.py
│  │     │  │  │  ├─ test_recfunctions.py
│  │     │  │  │  ├─ test_regression.py
│  │     │  │  │  ├─ test_shape_base.py
│  │     │  │  │  ├─ test_stride_tricks.py
│  │     │  │  │  ├─ test_twodim_base.py
│  │     │  │  │  ├─ test_type_check.py
│  │     │  │  │  ├─ test_ufunclike.py
│  │     │  │  │  ├─ test_utils.py
│  │     │  │  │  ├─ test__datasource.py
│  │     │  │  │  ├─ test__iotools.py
│  │     │  │  │  ├─ test__version.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ user_array.py
│  │     │  │  ├─ user_array.pyi
│  │     │  │  ├─ _arraypad_impl.py
│  │     │  │  ├─ _arraypad_impl.pyi
│  │     │  │  ├─ _arraysetops_impl.py
│  │     │  │  ├─ _arraysetops_impl.pyi
│  │     │  │  ├─ _arrayterator_impl.py
│  │     │  │  ├─ _arrayterator_impl.pyi
│  │     │  │  ├─ _array_utils_impl.py
│  │     │  │  ├─ _array_utils_impl.pyi
│  │     │  │  ├─ _datasource.py
│  │     │  │  ├─ _datasource.pyi
│  │     │  │  ├─ _format_impl.py
│  │     │  │  ├─ _format_impl.pyi
│  │     │  │  ├─ _function_base_impl.py
│  │     │  │  ├─ _function_base_impl.pyi
│  │     │  │  ├─ _histograms_impl.py
│  │     │  │  ├─ _histograms_impl.pyi
│  │     │  │  ├─ _index_tricks_impl.py
│  │     │  │  ├─ _index_tricks_impl.pyi
│  │     │  │  ├─ _iotools.py
│  │     │  │  ├─ _iotools.pyi
│  │     │  │  ├─ _nanfunctions_impl.py
│  │     │  │  ├─ _nanfunctions_impl.pyi
│  │     │  │  ├─ _npyio_impl.py
│  │     │  │  ├─ _npyio_impl.pyi
│  │     │  │  ├─ _polynomial_impl.py
│  │     │  │  ├─ _polynomial_impl.pyi
│  │     │  │  ├─ _scimath_impl.py
│  │     │  │  ├─ _scimath_impl.pyi
│  │     │  │  ├─ _shape_base_impl.py
│  │     │  │  ├─ _shape_base_impl.pyi
│  │     │  │  ├─ _stride_tricks_impl.py
│  │     │  │  ├─ _stride_tricks_impl.pyi
│  │     │  │  ├─ _twodim_base_impl.py
│  │     │  │  ├─ _twodim_base_impl.pyi
│  │     │  │  ├─ _type_check_impl.py
│  │     │  │  ├─ _type_check_impl.pyi
│  │     │  │  ├─ _ufunclike_impl.py
│  │     │  │  ├─ _ufunclike_impl.pyi
│  │     │  │  ├─ _user_array_impl.py
│  │     │  │  ├─ _user_array_impl.pyi
│  │     │  │  ├─ _utils_impl.py
│  │     │  │  ├─ _utils_impl.pyi
│  │     │  │  ├─ _version.py
│  │     │  │  ├─ _version.pyi
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ linalg
│  │     │  │  ├─ lapack_lite.cp314-win_amd64.lib
│  │     │  │  ├─ lapack_lite.cp314-win_amd64.pyd
│  │     │  │  ├─ lapack_lite.pyi
│  │     │  │  ├─ tests
│  │     │  │  │  ├─ test_deprecations.py
│  │     │  │  │  ├─ test_linalg.py
│  │     │  │  │  ├─ test_regression.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ _linalg.py
│  │     │  │  ├─ _linalg.pyi
│  │     │  │  ├─ _umath_linalg.cp314-win_amd64.lib
│  │     │  │  ├─ _umath_linalg.cp314-win_amd64.pyd
│  │     │  │  ├─ _umath_linalg.pyi
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ ma
│  │     │  │  ├─ API_CHANGES.txt
│  │     │  │  ├─ core.py
│  │     │  │  ├─ core.pyi
│  │     │  │  ├─ extras.py
│  │     │  │  ├─ extras.pyi
│  │     │  │  ├─ LICENSE
│  │     │  │  ├─ mrecords.py
│  │     │  │  ├─ mrecords.pyi
│  │     │  │  ├─ README.rst
│  │     │  │  ├─ tests
│  │     │  │  │  ├─ test_arrayobject.py
│  │     │  │  │  ├─ test_core.py
│  │     │  │  │  ├─ test_deprecations.py
│  │     │  │  │  ├─ test_extras.py
│  │     │  │  │  ├─ test_mrecords.py
│  │     │  │  │  ├─ test_old_ma.py
│  │     │  │  │  ├─ test_regression.py
│  │     │  │  │  ├─ test_subclassing.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ testutils.py
│  │     │  │  ├─ testutils.pyi
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ matlib.py
│  │     │  ├─ matlib.pyi
│  │     │  ├─ matrixlib
│  │     │  │  ├─ defmatrix.py
│  │     │  │  ├─ defmatrix.pyi
│  │     │  │  ├─ tests
│  │     │  │  │  ├─ test_defmatrix.py
│  │     │  │  │  ├─ test_interaction.py
│  │     │  │  │  ├─ test_masked_matrix.py
│  │     │  │  │  ├─ test_matrix_linalg.py
│  │     │  │  │  ├─ test_multiarray.py
│  │     │  │  │  ├─ test_numeric.py
│  │     │  │  │  ├─ test_regression.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ polynomial
│  │     │  │  ├─ chebyshev.py
│  │     │  │  ├─ chebyshev.pyi
│  │     │  │  ├─ hermite.py
│  │     │  │  ├─ hermite.pyi
│  │     │  │  ├─ hermite_e.py
│  │     │  │  ├─ hermite_e.pyi
│  │     │  │  ├─ laguerre.py
│  │     │  │  ├─ laguerre.pyi
│  │     │  │  ├─ legendre.py
│  │     │  │  ├─ legendre.pyi
│  │     │  │  ├─ polynomial.py
│  │     │  │  ├─ polynomial.pyi
│  │     │  │  ├─ polyutils.py
│  │     │  │  ├─ polyutils.pyi
│  │     │  │  ├─ tests
│  │     │  │  │  ├─ test_chebyshev.py
│  │     │  │  │  ├─ test_classes.py
│  │     │  │  │  ├─ test_hermite.py
│  │     │  │  │  ├─ test_hermite_e.py
│  │     │  │  │  ├─ test_laguerre.py
│  │     │  │  │  ├─ test_legendre.py
│  │     │  │  │  ├─ test_polynomial.py
│  │     │  │  │  ├─ test_polyutils.py
│  │     │  │  │  ├─ test_printing.py
│  │     │  │  │  ├─ test_symbol.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ _polybase.py
│  │     │  │  ├─ _polybase.pyi
│  │     │  │  ├─ _polytypes.pyi
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ py.typed
│  │     │  ├─ random
│  │     │  │  ├─ bit_generator.cp314-win_amd64.lib
│  │     │  │  ├─ bit_generator.cp314-win_amd64.pyd
│  │     │  │  ├─ bit_generator.pxd
│  │     │  │  ├─ bit_generator.pyi
│  │     │  │  ├─ c_distributions.pxd
│  │     │  │  ├─ lib
│  │     │  │  │  └─ npyrandom.lib
│  │     │  │  ├─ LICENSE.md
│  │     │  │  ├─ mtrand.cp314-win_amd64.lib
│  │     │  │  ├─ mtrand.cp314-win_amd64.pyd
│  │     │  │  ├─ mtrand.pyi
│  │     │  │  ├─ tests
│  │     │  │  │  ├─ data
│  │     │  │  │  │  ├─ generator_pcg64_np121.pkl.gz
│  │     │  │  │  │  ├─ generator_pcg64_np126.pkl.gz
│  │     │  │  │  │  ├─ mt19937-testset-1.csv
│  │     │  │  │  │  ├─ mt19937-testset-2.csv
│  │     │  │  │  │  ├─ pcg64-testset-1.csv
│  │     │  │  │  │  ├─ pcg64-testset-2.csv
│  │     │  │  │  │  ├─ pcg64dxsm-testset-1.csv
│  │     │  │  │  │  ├─ pcg64dxsm-testset-2.csv
│  │     │  │  │  │  ├─ philox-testset-1.csv
│  │     │  │  │  │  ├─ philox-testset-2.csv
│  │     │  │  │  │  ├─ sfc64-testset-1.csv
│  │     │  │  │  │  ├─ sfc64-testset-2.csv
│  │     │  │  │  │  ├─ sfc64_np126.pkl.gz
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ test_direct.py
│  │     │  │  │  ├─ test_extending.py
│  │     │  │  │  ├─ test_generator_mt19937.py
│  │     │  │  │  ├─ test_generator_mt19937_regressions.py
│  │     │  │  │  ├─ test_random.py
│  │     │  │  │  ├─ test_randomstate.py
│  │     │  │  │  ├─ test_randomstate_regression.py
│  │     │  │  │  ├─ test_regression.py
│  │     │  │  │  ├─ test_seed_sequence.py
│  │     │  │  │  ├─ test_smoke.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ _bounded_integers.cp314-win_amd64.lib
│  │     │  │  ├─ _bounded_integers.cp314-win_amd64.pyd
│  │     │  │  ├─ _bounded_integers.pxd
│  │     │  │  ├─ _bounded_integers.pyi
│  │     │  │  ├─ _common.cp314-win_amd64.lib
│  │     │  │  ├─ _common.cp314-win_amd64.pyd
│  │     │  │  ├─ _common.pxd
│  │     │  │  ├─ _common.pyi
│  │     │  │  ├─ _examples
│  │     │  │  │  ├─ cffi
│  │     │  │  │  │  ├─ extending.py
│  │     │  │  │  │  └─ parse.py
│  │     │  │  │  ├─ cython
│  │     │  │  │  │  ├─ extending.pyx
│  │     │  │  │  │  ├─ extending_distributions.pyx
│  │     │  │  │  │  └─ meson.build
│  │     │  │  │  └─ numba
│  │     │  │  │     ├─ extending.py
│  │     │  │  │     └─ extending_distributions.py
│  │     │  │  ├─ _generator.cp314-win_amd64.lib
│  │     │  │  ├─ _generator.cp314-win_amd64.pyd
│  │     │  │  ├─ _generator.pyi
│  │     │  │  ├─ _mt19937.cp314-win_amd64.lib
│  │     │  │  ├─ _mt19937.cp314-win_amd64.pyd
│  │     │  │  ├─ _mt19937.pyi
│  │     │  │  ├─ _pcg64.cp314-win_amd64.lib
│  │     │  │  ├─ _pcg64.cp314-win_amd64.pyd
│  │     │  │  ├─ _pcg64.pyi
│  │     │  │  ├─ _philox.cp314-win_amd64.lib
│  │     │  │  ├─ _philox.cp314-win_amd64.pyd
│  │     │  │  ├─ _philox.pyi
│  │     │  │  ├─ _pickle.py
│  │     │  │  ├─ _pickle.pyi
│  │     │  │  ├─ _sfc64.cp314-win_amd64.lib
│  │     │  │  ├─ _sfc64.cp314-win_amd64.pyd
│  │     │  │  ├─ _sfc64.pyi
│  │     │  │  ├─ __init__.pxd
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ rec
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ strings
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ testing
│  │     │  │  ├─ overrides.py
│  │     │  │  ├─ overrides.pyi
│  │     │  │  ├─ print_coercion_tables.py
│  │     │  │  ├─ print_coercion_tables.pyi
│  │     │  │  ├─ tests
│  │     │  │  │  ├─ test_utils.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ _private
│  │     │  │  │  ├─ extbuild.py
│  │     │  │  │  ├─ extbuild.pyi
│  │     │  │  │  ├─ utils.py
│  │     │  │  │  ├─ utils.pyi
│  │     │  │  │  ├─ __init__.py
│  │     │  │  │  └─ __init__.pyi
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ tests
│  │     │  │  ├─ test_configtool.py
│  │     │  │  ├─ test_ctypeslib.py
│  │     │  │  ├─ test_lazyloading.py
│  │     │  │  ├─ test_matlib.py
│  │     │  │  ├─ test_numpy_config.py
│  │     │  │  ├─ test_numpy_version.py
│  │     │  │  ├─ test_public_api.py
│  │     │  │  ├─ test_reloading.py
│  │     │  │  ├─ test_scripts.py
│  │     │  │  ├─ test_warnings.py
│  │     │  │  ├─ test__all__.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ typing
│  │     │  │  ├─ mypy_plugin.py
│  │     │  │  ├─ tests
│  │     │  │  │  ├─ data
│  │     │  │  │  │  ├─ fail
│  │     │  │  │  │  │  ├─ arithmetic.pyi
│  │     │  │  │  │  │  ├─ arrayprint.pyi
│  │     │  │  │  │  │  ├─ arrayterator.pyi
│  │     │  │  │  │  │  ├─ array_constructors.pyi
│  │     │  │  │  │  │  ├─ array_like.pyi
│  │     │  │  │  │  │  ├─ array_pad.pyi
│  │     │  │  │  │  │  ├─ bitwise_ops.pyi
│  │     │  │  │  │  │  ├─ char.pyi
│  │     │  │  │  │  │  ├─ chararray.pyi
│  │     │  │  │  │  │  ├─ comparisons.pyi
│  │     │  │  │  │  │  ├─ constants.pyi
│  │     │  │  │  │  │  ├─ datasource.pyi
│  │     │  │  │  │  │  ├─ dtype.pyi
│  │     │  │  │  │  │  ├─ einsumfunc.pyi
│  │     │  │  │  │  │  ├─ flatiter.pyi
│  │     │  │  │  │  │  ├─ fromnumeric.pyi
│  │     │  │  │  │  │  ├─ histograms.pyi
│  │     │  │  │  │  │  ├─ index_tricks.pyi
│  │     │  │  │  │  │  ├─ lib_function_base.pyi
│  │     │  │  │  │  │  ├─ lib_polynomial.pyi
│  │     │  │  │  │  │  ├─ lib_utils.pyi
│  │     │  │  │  │  │  ├─ lib_version.pyi
│  │     │  │  │  │  │  ├─ linalg.pyi
│  │     │  │  │  │  │  ├─ ma.pyi
│  │     │  │  │  │  │  ├─ memmap.pyi
│  │     │  │  │  │  │  ├─ modules.pyi
│  │     │  │  │  │  │  ├─ multiarray.pyi
│  │     │  │  │  │  │  ├─ ndarray.pyi
│  │     │  │  │  │  │  ├─ ndarray_misc.pyi
│  │     │  │  │  │  │  ├─ nditer.pyi
│  │     │  │  │  │  │  ├─ nested_sequence.pyi
│  │     │  │  │  │  │  ├─ npyio.pyi
│  │     │  │  │  │  │  ├─ numerictypes.pyi
│  │     │  │  │  │  │  ├─ random.pyi
│  │     │  │  │  │  │  ├─ rec.pyi
│  │     │  │  │  │  │  ├─ scalars.pyi
│  │     │  │  │  │  │  ├─ shape.pyi
│  │     │  │  │  │  │  ├─ shape_base.pyi
│  │     │  │  │  │  │  ├─ stride_tricks.pyi
│  │     │  │  │  │  │  ├─ strings.pyi
│  │     │  │  │  │  │  ├─ testing.pyi
│  │     │  │  │  │  │  ├─ twodim_base.pyi
│  │     │  │  │  │  │  ├─ type_check.pyi
│  │     │  │  │  │  │  ├─ ufunclike.pyi
│  │     │  │  │  │  │  ├─ ufuncs.pyi
│  │     │  │  │  │  │  ├─ ufunc_config.pyi
│  │     │  │  │  │  │  └─ warnings_and_errors.pyi
│  │     │  │  │  │  ├─ misc
│  │     │  │  │  │  │  └─ extended_precision.pyi
│  │     │  │  │  │  ├─ mypy.ini
│  │     │  │  │  │  ├─ pass
│  │     │  │  │  │  │  ├─ arithmetic.py
│  │     │  │  │  │  │  ├─ arrayprint.py
│  │     │  │  │  │  │  ├─ arrayterator.py
│  │     │  │  │  │  │  ├─ array_constructors.py
│  │     │  │  │  │  │  ├─ array_like.py
│  │     │  │  │  │  │  ├─ bitwise_ops.py
│  │     │  │  │  │  │  ├─ comparisons.py
│  │     │  │  │  │  │  ├─ dtype.py
│  │     │  │  │  │  │  ├─ einsumfunc.py
│  │     │  │  │  │  │  ├─ flatiter.py
│  │     │  │  │  │  │  ├─ fromnumeric.py
│  │     │  │  │  │  │  ├─ index_tricks.py
│  │     │  │  │  │  │  ├─ lib_user_array.py
│  │     │  │  │  │  │  ├─ lib_utils.py
│  │     │  │  │  │  │  ├─ lib_version.py
│  │     │  │  │  │  │  ├─ literal.py
│  │     │  │  │  │  │  ├─ ma.py
│  │     │  │  │  │  │  ├─ mod.py
│  │     │  │  │  │  │  ├─ modules.py
│  │     │  │  │  │  │  ├─ multiarray.py
│  │     │  │  │  │  │  ├─ ndarray_conversion.py
│  │     │  │  │  │  │  ├─ ndarray_misc.py
│  │     │  │  │  │  │  ├─ ndarray_shape_manipulation.py
│  │     │  │  │  │  │  ├─ nditer.py
│  │     │  │  │  │  │  ├─ numeric.py
│  │     │  │  │  │  │  ├─ numerictypes.py
│  │     │  │  │  │  │  ├─ random.py
│  │     │  │  │  │  │  ├─ recfunctions.py
│  │     │  │  │  │  │  ├─ scalars.py
│  │     │  │  │  │  │  ├─ shape.py
│  │     │  │  │  │  │  ├─ simple.py
│  │     │  │  │  │  │  ├─ ufunclike.py
│  │     │  │  │  │  │  ├─ ufuncs.py
│  │     │  │  │  │  │  ├─ ufunc_config.py
│  │     │  │  │  │  │  └─ warnings_and_errors.py
│  │     │  │  │  │  └─ reveal
│  │     │  │  │  │     ├─ arithmetic.pyi
│  │     │  │  │  │     ├─ arraypad.pyi
│  │     │  │  │  │     ├─ arrayprint.pyi
│  │     │  │  │  │     ├─ arraysetops.pyi
│  │     │  │  │  │     ├─ arrayterator.pyi
│  │     │  │  │  │     ├─ array_api_info.pyi
│  │     │  │  │  │     ├─ array_constructors.pyi
│  │     │  │  │  │     ├─ bitwise_ops.pyi
│  │     │  │  │  │     ├─ char.pyi
│  │     │  │  │  │     ├─ chararray.pyi
│  │     │  │  │  │     ├─ comparisons.pyi
│  │     │  │  │  │     ├─ constants.pyi
│  │     │  │  │  │     ├─ ctypeslib.pyi
│  │     │  │  │  │     ├─ datasource.pyi
│  │     │  │  │  │     ├─ dtype.pyi
│  │     │  │  │  │     ├─ einsumfunc.pyi
│  │     │  │  │  │     ├─ emath.pyi
│  │     │  │  │  │     ├─ fft.pyi
│  │     │  │  │  │     ├─ flatiter.pyi
│  │     │  │  │  │     ├─ fromnumeric.pyi
│  │     │  │  │  │     ├─ getlimits.pyi
│  │     │  │  │  │     ├─ histograms.pyi
│  │     │  │  │  │     ├─ index_tricks.pyi
│  │     │  │  │  │     ├─ lib_function_base.pyi
│  │     │  │  │  │     ├─ lib_polynomial.pyi
│  │     │  │  │  │     ├─ lib_utils.pyi
│  │     │  │  │  │     ├─ lib_version.pyi
│  │     │  │  │  │     ├─ linalg.pyi
│  │     │  │  │  │     ├─ ma.pyi
│  │     │  │  │  │     ├─ matrix.pyi
│  │     │  │  │  │     ├─ memmap.pyi
│  │     │  │  │  │     ├─ mod.pyi
│  │     │  │  │  │     ├─ modules.pyi
│  │     │  │  │  │     ├─ multiarray.pyi
│  │     │  │  │  │     ├─ nbit_base_example.pyi
│  │     │  │  │  │     ├─ ndarray_assignability.pyi
│  │     │  │  │  │     ├─ ndarray_conversion.pyi
│  │     │  │  │  │     ├─ ndarray_misc.pyi
│  │     │  │  │  │     ├─ ndarray_shape_manipulation.pyi
│  │     │  │  │  │     ├─ nditer.pyi
│  │     │  │  │  │     ├─ nested_sequence.pyi
│  │     │  │  │  │     ├─ npyio.pyi
│  │     │  │  │  │     ├─ numeric.pyi
│  │     │  │  │  │     ├─ numerictypes.pyi
│  │     │  │  │  │     ├─ polynomial_polybase.pyi
│  │     │  │  │  │     ├─ polynomial_polyutils.pyi
│  │     │  │  │  │     ├─ polynomial_series.pyi
│  │     │  │  │  │     ├─ random.pyi
│  │     │  │  │  │     ├─ rec.pyi
│  │     │  │  │  │     ├─ scalars.pyi
│  │     │  │  │  │     ├─ shape.pyi
│  │     │  │  │  │     ├─ shape_base.pyi
│  │     │  │  │  │     ├─ stride_tricks.pyi
│  │     │  │  │  │     ├─ strings.pyi
│  │     │  │  │  │     ├─ testing.pyi
│  │     │  │  │  │     ├─ twodim_base.pyi
│  │     │  │  │  │     ├─ type_check.pyi
│  │     │  │  │  │     ├─ ufunclike.pyi
│  │     │  │  │  │     ├─ ufuncs.pyi
│  │     │  │  │  │     ├─ ufunc_config.pyi
│  │     │  │  │  │     └─ warnings_and_errors.pyi
│  │     │  │  │  ├─ test_isfile.py
│  │     │  │  │  ├─ test_runtime.py
│  │     │  │  │  ├─ test_typing.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ version.py
│  │     │  ├─ version.pyi
│  │     │  ├─ _array_api_info.py
│  │     │  ├─ _array_api_info.pyi
│  │     │  ├─ _configtool.py
│  │     │  ├─ _configtool.pyi
│  │     │  ├─ _core
│  │     │  │  ├─ arrayprint.py
│  │     │  │  ├─ arrayprint.pyi
│  │     │  │  ├─ cversions.py
│  │     │  │  ├─ defchararray.py
│  │     │  │  ├─ defchararray.pyi
│  │     │  │  ├─ einsumfunc.py
│  │     │  │  ├─ einsumfunc.pyi
│  │     │  │  ├─ fromnumeric.py
│  │     │  │  ├─ fromnumeric.pyi
│  │     │  │  ├─ function_base.py
│  │     │  │  ├─ function_base.pyi
│  │     │  │  ├─ getlimits.py
│  │     │  │  ├─ getlimits.pyi
│  │     │  │  ├─ include
│  │     │  │  │  └─ numpy
│  │     │  │  │     ├─ arrayobject.h
│  │     │  │  │     ├─ arrayscalars.h
│  │     │  │  │     ├─ dtype_api.h
│  │     │  │  │     ├─ halffloat.h
│  │     │  │  │     ├─ ndarrayobject.h
│  │     │  │  │     ├─ ndarraytypes.h
│  │     │  │  │     ├─ npy_2_compat.h
│  │     │  │  │     ├─ npy_2_complexcompat.h
│  │     │  │  │     ├─ npy_3kcompat.h
│  │     │  │  │     ├─ npy_common.h
│  │     │  │  │     ├─ npy_cpu.h
│  │     │  │  │     ├─ npy_endian.h
│  │     │  │  │     ├─ npy_math.h
│  │     │  │  │     ├─ npy_no_deprecated_api.h
│  │     │  │  │     ├─ npy_os.h
│  │     │  │  │     ├─ numpyconfig.h
│  │     │  │  │     ├─ random
│  │     │  │  │     │  ├─ bitgen.h
│  │     │  │  │     │  ├─ distributions.h
│  │     │  │  │     │  ├─ libdivide.h
│  │     │  │  │     │  └─ LICENSE.txt
│  │     │  │  │     ├─ ufuncobject.h
│  │     │  │  │     ├─ utils.h
│  │     │  │  │     ├─ _neighborhood_iterator_imp.h
│  │     │  │  │     ├─ _numpyconfig.h
│  │     │  │  │     ├─ _public_dtype_api_table.h
│  │     │  │  │     ├─ __multiarray_api.c
│  │     │  │  │     ├─ __multiarray_api.h
│  │     │  │  │     ├─ __ufunc_api.c
│  │     │  │  │     └─ __ufunc_api.h
│  │     │  │  ├─ lib
│  │     │  │  │  ├─ npymath.lib
│  │     │  │  │  └─ pkgconfig
│  │     │  │  │     └─ numpy.pc
│  │     │  │  ├─ memmap.py
│  │     │  │  ├─ memmap.pyi
│  │     │  │  ├─ multiarray.py
│  │     │  │  ├─ multiarray.pyi
│  │     │  │  ├─ numeric.py
│  │     │  │  ├─ numeric.pyi
│  │     │  │  ├─ numerictypes.py
│  │     │  │  ├─ numerictypes.pyi
│  │     │  │  ├─ overrides.py
│  │     │  │  ├─ overrides.pyi
│  │     │  │  ├─ printoptions.py
│  │     │  │  ├─ printoptions.pyi
│  │     │  │  ├─ records.py
│  │     │  │  ├─ records.pyi
│  │     │  │  ├─ shape_base.py
│  │     │  │  ├─ shape_base.pyi
│  │     │  │  ├─ strings.py
│  │     │  │  ├─ strings.pyi
│  │     │  │  ├─ tests
│  │     │  │  │  ├─ data
│  │     │  │  │  │  ├─ astype_copy.pkl
│  │     │  │  │  │  ├─ generate_umath_validation_data.cpp
│  │     │  │  │  │  ├─ recarray_from_file.fits
│  │     │  │  │  │  ├─ umath-validation-set-arccos.csv
│  │     │  │  │  │  ├─ umath-validation-set-arccosh.csv
│  │     │  │  │  │  ├─ umath-validation-set-arcsin.csv
│  │     │  │  │  │  ├─ umath-validation-set-arcsinh.csv
│  │     │  │  │  │  ├─ umath-validation-set-arctan.csv
│  │     │  │  │  │  ├─ umath-validation-set-arctanh.csv
│  │     │  │  │  │  ├─ umath-validation-set-cbrt.csv
│  │     │  │  │  │  ├─ umath-validation-set-cos.csv
│  │     │  │  │  │  ├─ umath-validation-set-cosh.csv
│  │     │  │  │  │  ├─ umath-validation-set-exp.csv
│  │     │  │  │  │  ├─ umath-validation-set-exp2.csv
│  │     │  │  │  │  ├─ umath-validation-set-expm1.csv
│  │     │  │  │  │  ├─ umath-validation-set-log.csv
│  │     │  │  │  │  ├─ umath-validation-set-log10.csv
│  │     │  │  │  │  ├─ umath-validation-set-log1p.csv
│  │     │  │  │  │  ├─ umath-validation-set-log2.csv
│  │     │  │  │  │  ├─ umath-validation-set-README.txt
│  │     │  │  │  │  ├─ umath-validation-set-sin.csv
│  │     │  │  │  │  ├─ umath-validation-set-sinh.csv
│  │     │  │  │  │  ├─ umath-validation-set-tan.csv
│  │     │  │  │  │  └─ umath-validation-set-tanh.csv
│  │     │  │  │  ├─ examples
│  │     │  │  │  │  ├─ cython
│  │     │  │  │  │  │  ├─ checks.pyx
│  │     │  │  │  │  │  ├─ meson.build
│  │     │  │  │  │  │  └─ setup.py
│  │     │  │  │  │  └─ limited_api
│  │     │  │  │  │     ├─ limited_api.c
│  │     │  │  │  │     ├─ limited_api_cython.pyx
│  │     │  │  │  │     ├─ meson.build
│  │     │  │  │  │     └─ setup.py
│  │     │  │  │  ├─ test_abc.py
│  │     │  │  │  ├─ test_api.py
│  │     │  │  │  ├─ test_argparse.py
│  │     │  │  │  ├─ test_arraymethod.py
│  │     │  │  │  ├─ test_arrayobject.py
│  │     │  │  │  ├─ test_arrayprint.py
│  │     │  │  │  ├─ test_array_api_info.py
│  │     │  │  │  ├─ test_array_coercion.py
│  │     │  │  │  ├─ test_array_interface.py
│  │     │  │  │  ├─ test_casting_floatingpoint_errors.py
│  │     │  │  │  ├─ test_casting_unittests.py
│  │     │  │  │  ├─ test_conversion_utils.py
│  │     │  │  │  ├─ test_cpu_dispatcher.py
│  │     │  │  │  ├─ test_cpu_features.py
│  │     │  │  │  ├─ test_custom_dtypes.py
│  │     │  │  │  ├─ test_cython.py
│  │     │  │  │  ├─ test_datetime.py
│  │     │  │  │  ├─ test_defchararray.py
│  │     │  │  │  ├─ test_deprecations.py
│  │     │  │  │  ├─ test_dlpack.py
│  │     │  │  │  ├─ test_dtype.py
│  │     │  │  │  ├─ test_einsum.py
│  │     │  │  │  ├─ test_errstate.py
│  │     │  │  │  ├─ test_extint128.py
│  │     │  │  │  ├─ test_finfo.py
│  │     │  │  │  ├─ test_function_base.py
│  │     │  │  │  ├─ test_getlimits.py
│  │     │  │  │  ├─ test_half.py
│  │     │  │  │  ├─ test_hashtable.py
│  │     │  │  │  ├─ test_indexerrors.py
│  │     │  │  │  ├─ test_indexing.py
│  │     │  │  │  ├─ test_item_selection.py
│  │     │  │  │  ├─ test_limited_api.py
│  │     │  │  │  ├─ test_longdouble.py
│  │     │  │  │  ├─ test_memmap.py
│  │     │  │  │  ├─ test_mem_overlap.py
│  │     │  │  │  ├─ test_mem_policy.py
│  │     │  │  │  ├─ test_multiarray.py
│  │     │  │  │  ├─ test_multiprocessing.py
│  │     │  │  │  ├─ test_multithreading.py
│  │     │  │  │  ├─ test_nditer.py
│  │     │  │  │  ├─ test_nep50_promotions.py
│  │     │  │  │  ├─ test_numeric.py
│  │     │  │  │  ├─ test_numerictypes.py
│  │     │  │  │  ├─ test_overrides.py
│  │     │  │  │  ├─ test_print.py
│  │     │  │  │  ├─ test_protocols.py
│  │     │  │  │  ├─ test_records.py
│  │     │  │  │  ├─ test_regression.py
│  │     │  │  │  ├─ test_scalarbuffer.py
│  │     │  │  │  ├─ test_scalarinherit.py
│  │     │  │  │  ├─ test_scalarmath.py
│  │     │  │  │  ├─ test_scalarprint.py
│  │     │  │  │  ├─ test_scalar_ctors.py
│  │     │  │  │  ├─ test_scalar_methods.py
│  │     │  │  │  ├─ test_shape_base.py
│  │     │  │  │  ├─ test_simd.py
│  │     │  │  │  ├─ test_simd_module.py
│  │     │  │  │  ├─ test_stringdtype.py
│  │     │  │  │  ├─ test_strings.py
│  │     │  │  │  ├─ test_ufunc.py
│  │     │  │  │  ├─ test_umath.py
│  │     │  │  │  ├─ test_umath_accuracy.py
│  │     │  │  │  ├─ test_umath_complex.py
│  │     │  │  │  ├─ test_unicode.py
│  │     │  │  │  ├─ test__exceptions.py
│  │     │  │  │  ├─ _locales.py
│  │     │  │  │  └─ _natype.py
│  │     │  │  ├─ umath.py
│  │     │  │  ├─ umath.pyi
│  │     │  │  ├─ _add_newdocs.py
│  │     │  │  ├─ _add_newdocs.pyi
│  │     │  │  ├─ _add_newdocs_scalars.py
│  │     │  │  ├─ _add_newdocs_scalars.pyi
│  │     │  │  ├─ _asarray.py
│  │     │  │  ├─ _asarray.pyi
│  │     │  │  ├─ _dtype.py
│  │     │  │  ├─ _dtype.pyi
│  │     │  │  ├─ _dtype_ctypes.py
│  │     │  │  ├─ _dtype_ctypes.pyi
│  │     │  │  ├─ _exceptions.py
│  │     │  │  ├─ _exceptions.pyi
│  │     │  │  ├─ _internal.py
│  │     │  │  ├─ _internal.pyi
│  │     │  │  ├─ _methods.py
│  │     │  │  ├─ _methods.pyi
│  │     │  │  ├─ _multiarray_tests.cp314-win_amd64.lib
│  │     │  │  ├─ _multiarray_tests.cp314-win_amd64.pyd
│  │     │  │  ├─ _multiarray_umath.cp314-win_amd64.lib
│  │     │  │  ├─ _multiarray_umath.cp314-win_amd64.pyd
│  │     │  │  ├─ _operand_flag_tests.cp314-win_amd64.lib
│  │     │  │  ├─ _operand_flag_tests.cp314-win_amd64.pyd
│  │     │  │  ├─ _rational_tests.cp314-win_amd64.lib
│  │     │  │  ├─ _rational_tests.cp314-win_amd64.pyd
│  │     │  │  ├─ _simd.cp314-win_amd64.lib
│  │     │  │  ├─ _simd.cp314-win_amd64.pyd
│  │     │  │  ├─ _simd.pyi
│  │     │  │  ├─ _string_helpers.py
│  │     │  │  ├─ _string_helpers.pyi
│  │     │  │  ├─ _struct_ufunc_tests.cp314-win_amd64.lib
│  │     │  │  ├─ _struct_ufunc_tests.cp314-win_amd64.pyd
│  │     │  │  ├─ _type_aliases.py
│  │     │  │  ├─ _type_aliases.pyi
│  │     │  │  ├─ _ufunc_config.py
│  │     │  │  ├─ _ufunc_config.pyi
│  │     │  │  ├─ _umath_tests.cp314-win_amd64.lib
│  │     │  │  ├─ _umath_tests.cp314-win_amd64.pyd
│  │     │  │  ├─ _umath_tests.pyi
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ _distributor_init.py
│  │     │  ├─ _distributor_init.pyi
│  │     │  ├─ _expired_attrs_2_0.py
│  │     │  ├─ _expired_attrs_2_0.pyi
│  │     │  ├─ _globals.py
│  │     │  ├─ _globals.pyi
│  │     │  ├─ _pyinstaller
│  │     │  │  ├─ hook-numpy.py
│  │     │  │  ├─ hook-numpy.pyi
│  │     │  │  ├─ tests
│  │     │  │  │  ├─ pyinstaller-smoke.py
│  │     │  │  │  ├─ test_pyinstaller.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ _pytesttester.py
│  │     │  ├─ _pytesttester.pyi
│  │     │  ├─ _typing
│  │     │  │  ├─ _add_docstring.py
│  │     │  │  ├─ _array_like.py
│  │     │  │  ├─ _char_codes.py
│  │     │  │  ├─ _dtype_like.py
│  │     │  │  ├─ _extended_precision.py
│  │     │  │  ├─ _nbit.py
│  │     │  │  ├─ _nbit_base.py
│  │     │  │  ├─ _nbit_base.pyi
│  │     │  │  ├─ _nested_sequence.py
│  │     │  │  ├─ _scalars.py
│  │     │  │  ├─ _shape.py
│  │     │  │  ├─ _ufunc.py
│  │     │  │  ├─ _ufunc.pyi
│  │     │  │  └─ __init__.py
│  │     │  ├─ _utils
│  │     │  │  ├─ _conversions.py
│  │     │  │  ├─ _conversions.pyi
│  │     │  │  ├─ _inspect.py
│  │     │  │  ├─ _inspect.pyi
│  │     │  │  ├─ _pep440.py
│  │     │  │  ├─ _pep440.pyi
│  │     │  │  ├─ __init__.py
│  │     │  │  └─ __init__.pyi
│  │     │  ├─ __config__.py
│  │     │  ├─ __config__.pyi
│  │     │  ├─ __init__.cython-30.pxd
│  │     │  ├─ __init__.pxd
│  │     │  ├─ __init__.py
│  │     │  └─ __init__.pyi
│  │     ├─ numpy-2.5.3.dist-info
│  │     │  ├─ DELVEWHEEL
│  │     │  ├─ entry_points.txt
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  ├─ LICENSE.txt
│  │     │  │  └─ numpy
│  │     │  │     ├─ fft
│  │     │  │     │  └─ pocketfft
│  │     │  │     │     └─ LICENSE.md
│  │     │  │     ├─ linalg
│  │     │  │     │  └─ lapack_lite
│  │     │  │     │     └─ LICENSE.txt
│  │     │  │     ├─ ma
│  │     │  │     │  └─ LICENSE
│  │     │  │     ├─ random
│  │     │  │     │  ├─ LICENSE.md
│  │     │  │     │  └─ src
│  │     │  │     │     ├─ distributions
│  │     │  │     │     │  └─ LICENSE.md
│  │     │  │     │     ├─ mt19937
│  │     │  │     │     │  └─ LICENSE.md
│  │     │  │     │     ├─ pcg64
│  │     │  │     │     │  └─ LICENSE.md
│  │     │  │     │     ├─ philox
│  │     │  │     │     │  └─ LICENSE.md
│  │     │  │     │     ├─ sfc64
│  │     │  │     │     │  └─ LICENSE.md
│  │     │  │     │     └─ splitmix64
│  │     │  │     │        └─ LICENSE.md
│  │     │  │     └─ _core
│  │     │  │        ├─ include
│  │     │  │        │  └─ numpy
│  │     │  │        │     └─ libdivide
│  │     │  │        │        └─ LICENSE.txt
│  │     │  │        └─ src
│  │     │  │           ├─ common
│  │     │  │           │  └─ pythoncapi-compat
│  │     │  │           │     └─ COPYING
│  │     │  │           ├─ highway
│  │     │  │           │  └─ LICENSE
│  │     │  │           ├─ multiarray
│  │     │  │           │  └─ dragon4_LICENSE.txt
│  │     │  │           ├─ npysort
│  │     │  │           │  └─ x86-simd-sort
│  │     │  │           │     └─ LICENSE.md
│  │     │  │           └─ umath
│  │     │  │              └─ svml
│  │     │  │                 └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  └─ WHEEL
│  │     ├─ numpy.libs
│  │     │  ├─ libscipy_openblas64_-ed4f167a5330424524f45258e7ca2c8d.dll
│  │     │  └─ msvcp140-a4c2229bdc2a2a630acdc095b4d86008.dll
│  │     ├─ openai
│  │     │  ├─ auth
│  │     │  │  ├─ _workload.py
│  │     │  │  ├─ _x509.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ helpers
│  │     │  │  ├─ local_audio_player.py
│  │     │  │  ├─ microphone.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ lib
│  │     │  │  ├─ .keep
│  │     │  │  ├─ azure.py
│  │     │  │  ├─ bedrock.py
│  │     │  │  ├─ beta
│  │     │  │  │  ├─ agents
│  │     │  │  │  │  ├─ _artifacts.py
│  │     │  │  │  │  ├─ _files.py
│  │     │  │  │  │  ├─ _output.py
│  │     │  │  │  │  ├─ _result.py
│  │     │  │  │  │  ├─ _schema.py
│  │     │  │  │  │  ├─ _stream.py
│  │     │  │  │  │  ├─ _tools.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ live
│  │     │  │  │  ├─ README.md
│  │     │  │  │  ├─ _listeners.py
│  │     │  │  │  ├─ _transcript_grouper.py
│  │     │  │  │  ├─ _transcript_grouping.py
│  │     │  │  │  ├─ _transcript_state.py
│  │     │  │  │  ├─ _types.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ responses_websocket
│  │     │  │  │  ├─ README.md
│  │     │  │  │  ├─ _accumulator.py
│  │     │  │  │  ├─ _session.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ streaming
│  │     │  │  │  ├─ agents
│  │     │  │  │  │  ├─ _streams.py
│  │     │  │  │  │  ├─ _tools.py
│  │     │  │  │  │  ├─ _types.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ chat
│  │     │  │  │  │  ├─ _completions.py
│  │     │  │  │  │  ├─ _events.py
│  │     │  │  │  │  ├─ _types.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ responses
│  │     │  │  │  │  ├─ _events.py
│  │     │  │  │  │  ├─ _responses.py
│  │     │  │  │  │  ├─ _types.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ _assistants.py
│  │     │  │  │  ├─ _deltas.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ _azure_websocket.py
│  │     │  │  ├─ _bedrock_auth.py
│  │     │  │  ├─ _files.py
│  │     │  │  ├─ _old_api.py
│  │     │  │  ├─ _parsing
│  │     │  │  │  ├─ _audio.py
│  │     │  │  │  ├─ _completions.py
│  │     │  │  │  ├─ _embeddings.py
│  │     │  │  │  ├─ _responses.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ _pydantic.py
│  │     │  │  ├─ _realtime.py
│  │     │  │  ├─ _tools.py
│  │     │  │  ├─ _vector_stores.py
│  │     │  │  ├─ _webhooks.py
│  │     │  │  ├─ _websocket.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ pagination.py
│  │     │  ├─ providers
│  │     │  │  ├─ bedrock.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ py.typed
│  │     │  ├─ resources
│  │     │  │  ├─ admin
│  │     │  │  │  ├─ admin.py
│  │     │  │  │  ├─ organization
│  │     │  │  │  │  ├─ admin_api_keys.py
│  │     │  │  │  │  ├─ audit_logs.py
│  │     │  │  │  │  ├─ certificates.py
│  │     │  │  │  │  ├─ data_retention.py
│  │     │  │  │  │  ├─ external_storage.py
│  │     │  │  │  │  ├─ groups
│  │     │  │  │  │  │  ├─ groups.py
│  │     │  │  │  │  │  ├─ roles.py
│  │     │  │  │  │  │  ├─ users.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ invites.py
│  │     │  │  │  │  ├─ organization.py
│  │     │  │  │  │  ├─ projects
│  │     │  │  │  │  │  ├─ api_keys.py
│  │     │  │  │  │  │  ├─ certificates.py
│  │     │  │  │  │  │  ├─ data_retention.py
│  │     │  │  │  │  │  ├─ groups
│  │     │  │  │  │  │  │  ├─ groups.py
│  │     │  │  │  │  │  │  ├─ roles.py
│  │     │  │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  │  ├─ hosted_tool_permissions.py
│  │     │  │  │  │  │  ├─ model_permissions.py
│  │     │  │  │  │  │  ├─ projects.py
│  │     │  │  │  │  │  ├─ rate_limits.py
│  │     │  │  │  │  │  ├─ roles.py
│  │     │  │  │  │  │  ├─ service_accounts
│  │     │  │  │  │  │  │  ├─ api_keys.py
│  │     │  │  │  │  │  │  ├─ service_accounts.py
│  │     │  │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  │  ├─ spend_alerts.py
│  │     │  │  │  │  │  ├─ spend_limit.py
│  │     │  │  │  │  │  ├─ users
│  │     │  │  │  │  │  │  ├─ roles.py
│  │     │  │  │  │  │  │  ├─ users.py
│  │     │  │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ roles.py
│  │     │  │  │  │  ├─ spend_alerts.py
│  │     │  │  │  │  ├─ spend_limit.py
│  │     │  │  │  │  ├─ usage.py
│  │     │  │  │  │  ├─ users
│  │     │  │  │  │  │  ├─ roles.py
│  │     │  │  │  │  │  ├─ users.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ audio
│  │     │  │  │  ├─ audio.py
│  │     │  │  │  ├─ speech.py
│  │     │  │  │  ├─ transcriptions.py
│  │     │  │  │  ├─ translations.py
│  │     │  │  │  ├─ voices.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ batches.py
│  │     │  │  ├─ beta
│  │     │  │  │  ├─ agents
│  │     │  │  │  │  ├─ agents.py
│  │     │  │  │  │  ├─ environments
│  │     │  │  │  │  │  ├─ environments.py
│  │     │  │  │  │  │  ├─ files.py
│  │     │  │  │  │  │  ├─ templates.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ sessions
│  │     │  │  │  │  │  ├─ artifacts.py
│  │     │  │  │  │  │  ├─ events.py
│  │     │  │  │  │  │  ├─ items.py
│  │     │  │  │  │  │  ├─ sessions.py
│  │     │  │  │  │  │  ├─ subagents
│  │     │  │  │  │  │  │  ├─ items.py
│  │     │  │  │  │  │  │  ├─ subagents.py
│  │     │  │  │  │  │  │  ├─ turns
│  │     │  │  │  │  │  │  │  ├─ items.py
│  │     │  │  │  │  │  │  │  ├─ turns.py
│  │     │  │  │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  │  ├─ traces.py
│  │     │  │  │  │  │  ├─ turns.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ vaults
│  │     │  │  │  │  │  ├─ credentials.py
│  │     │  │  │  │  │  ├─ vaults.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ assistants.py
│  │     │  │  │  ├─ beta.py
│  │     │  │  │  ├─ chatkit
│  │     │  │  │  │  ├─ chatkit.py
│  │     │  │  │  │  ├─ sessions.py
│  │     │  │  │  │  ├─ threads.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ realtime
│  │     │  │  │  │  ├─ realtime.py
│  │     │  │  │  │  ├─ sessions.py
│  │     │  │  │  │  ├─ transcription_sessions.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ responses
│  │     │  │  │  │  ├─ input_items.py
│  │     │  │  │  │  ├─ input_tokens.py
│  │     │  │  │  │  ├─ responses.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ threads
│  │     │  │  │  │  ├─ messages.py
│  │     │  │  │  │  ├─ runs
│  │     │  │  │  │  │  ├─ runs.py
│  │     │  │  │  │  │  ├─ steps.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ threads.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ chat
│  │     │  │  │  ├─ chat.py
│  │     │  │  │  ├─ completions
│  │     │  │  │  │  ├─ completions.py
│  │     │  │  │  │  ├─ messages.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ completions.py
│  │     │  │  ├─ containers
│  │     │  │  │  ├─ containers.py
│  │     │  │  │  ├─ files
│  │     │  │  │  │  ├─ content.py
│  │     │  │  │  │  ├─ files.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ content_provenance_checks.py
│  │     │  │  ├─ conversations
│  │     │  │  │  ├─ api.md
│  │     │  │  │  ├─ conversations.py
│  │     │  │  │  ├─ items.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ embeddings.py
│  │     │  │  ├─ evals
│  │     │  │  │  ├─ evals.py
│  │     │  │  │  ├─ runs
│  │     │  │  │  │  ├─ output_items.py
│  │     │  │  │  │  ├─ runs.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ files.py
│  │     │  │  ├─ fine_tuning
│  │     │  │  │  ├─ alpha
│  │     │  │  │  │  ├─ alpha.py
│  │     │  │  │  │  ├─ graders.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ checkpoints
│  │     │  │  │  │  ├─ checkpoints.py
│  │     │  │  │  │  ├─ permissions.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ fine_tuning.py
│  │     │  │  │  ├─ jobs
│  │     │  │  │  │  ├─ checkpoints.py
│  │     │  │  │  │  ├─ jobs.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ images.py
│  │     │  │  ├─ live
│  │     │  │  │  ├─ api.md
│  │     │  │  │  ├─ forks.py
│  │     │  │  │  ├─ live.py
│  │     │  │  │  ├─ sessions.py
│  │     │  │  │  ├─ sideband.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ models.py
│  │     │  │  ├─ moderations.py
│  │     │  │  ├─ realtime
│  │     │  │  │  ├─ api.md
│  │     │  │  │  ├─ calls.py
│  │     │  │  │  ├─ client_secrets.py
│  │     │  │  │  ├─ realtime.py
│  │     │  │  │  ├─ translations
│  │     │  │  │  │  ├─ client_secrets.py
│  │     │  │  │  │  ├─ translations.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ responses
│  │     │  │  │  ├─ api.md
│  │     │  │  │  ├─ input_items.py
│  │     │  │  │  ├─ input_tokens.py
│  │     │  │  │  ├─ responses.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ safety
│  │     │  │  │  ├─ alerts.py
│  │     │  │  │  ├─ cases.py
│  │     │  │  │  ├─ safety.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ skills
│  │     │  │  │  ├─ content.py
│  │     │  │  │  ├─ skills.py
│  │     │  │  │  ├─ versions
│  │     │  │  │  │  ├─ content.py
│  │     │  │  │  │  ├─ versions.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ uploads
│  │     │  │  │  ├─ parts.py
│  │     │  │  │  ├─ uploads.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ vector_stores
│  │     │  │  │  ├─ files.py
│  │     │  │  │  ├─ file_batches.py
│  │     │  │  │  ├─ vector_stores.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ videos.py
│  │     │  │  ├─ webhooks
│  │     │  │  │  ├─ api.md
│  │     │  │  │  ├─ event_types.py
│  │     │  │  │  ├─ webhooks.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ types
│  │     │  │  ├─ admin
│  │     │  │  │  ├─ organization
│  │     │  │  │  │  ├─ admin_api_key.py
│  │     │  │  │  │  ├─ admin_api_key_create_params.py
│  │     │  │  │  │  ├─ admin_api_key_create_response.py
│  │     │  │  │  │  ├─ admin_api_key_delete_response.py
│  │     │  │  │  │  ├─ admin_api_key_list_params.py
│  │     │  │  │  │  ├─ audit_log_list_params.py
│  │     │  │  │  │  ├─ audit_log_list_response.py
│  │     │  │  │  │  ├─ aws_external_storage_provider.py
│  │     │  │  │  │  ├─ azure_external_storage_provider.py
│  │     │  │  │  │  ├─ certificate.py
│  │     │  │  │  │  ├─ certificate_activate_params.py
│  │     │  │  │  │  ├─ certificate_activate_response.py
│  │     │  │  │  │  ├─ certificate_create_params.py
│  │     │  │  │  │  ├─ certificate_deactivate_params.py
│  │     │  │  │  │  ├─ certificate_deactivate_response.py
│  │     │  │  │  │  ├─ certificate_delete_response.py
│  │     │  │  │  │  ├─ certificate_list_params.py
│  │     │  │  │  │  ├─ certificate_list_response.py
│  │     │  │  │  │  ├─ certificate_retrieve_params.py
│  │     │  │  │  │  ├─ certificate_update_params.py
│  │     │  │  │  │  ├─ cost_quantity_unit.py
│  │     │  │  │  │  ├─ data_retention_update_params.py
│  │     │  │  │  │  ├─ external_storage_configuration.py
│  │     │  │  │  │  ├─ external_storage_create_params.py
│  │     │  │  │  │  ├─ external_storage_deleted.py
│  │     │  │  │  │  ├─ external_storage_list_params.py
│  │     │  │  │  │  ├─ gcp_external_storage_provider.py
│  │     │  │  │  │  ├─ group.py
│  │     │  │  │  │  ├─ groups
│  │     │  │  │  │  │  ├─ organization_group_user.py
│  │     │  │  │  │  │  ├─ role_create_params.py
│  │     │  │  │  │  │  ├─ role_create_response.py
│  │     │  │  │  │  │  ├─ role_delete_response.py
│  │     │  │  │  │  │  ├─ role_list_params.py
│  │     │  │  │  │  │  ├─ role_list_response.py
│  │     │  │  │  │  │  ├─ role_retrieve_response.py
│  │     │  │  │  │  │  ├─ user_create_params.py
│  │     │  │  │  │  │  ├─ user_create_response.py
│  │     │  │  │  │  │  ├─ user_delete_response.py
│  │     │  │  │  │  │  ├─ user_list_params.py
│  │     │  │  │  │  │  ├─ user_retrieve_response.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ group_create_params.py
│  │     │  │  │  │  ├─ group_delete_response.py
│  │     │  │  │  │  ├─ group_list_params.py
│  │     │  │  │  │  ├─ group_update_params.py
│  │     │  │  │  │  ├─ group_update_response.py
│  │     │  │  │  │  ├─ invite.py
│  │     │  │  │  │  ├─ invite_create_params.py
│  │     │  │  │  │  ├─ invite_delete_response.py
│  │     │  │  │  │  ├─ invite_list_params.py
│  │     │  │  │  │  ├─ organization_data_retention.py
│  │     │  │  │  │  ├─ organization_spend_alert.py
│  │     │  │  │  │  ├─ organization_spend_alert_deleted.py
│  │     │  │  │  │  ├─ organization_spend_limit.py
│  │     │  │  │  │  ├─ organization_spend_limit_deleted.py
│  │     │  │  │  │  ├─ organization_user.py
│  │     │  │  │  │  ├─ project.py
│  │     │  │  │  │  ├─ projects
│  │     │  │  │  │  │  ├─ api_key_delete_response.py
│  │     │  │  │  │  │  ├─ api_key_list_params.py
│  │     │  │  │  │  │  ├─ certificate_activate_params.py
│  │     │  │  │  │  │  ├─ certificate_activate_response.py
│  │     │  │  │  │  │  ├─ certificate_deactivate_params.py
│  │     │  │  │  │  │  ├─ certificate_deactivate_response.py
│  │     │  │  │  │  │  ├─ certificate_list_params.py
│  │     │  │  │  │  │  ├─ certificate_list_response.py
│  │     │  │  │  │  │  ├─ data_retention_update_params.py
│  │     │  │  │  │  │  ├─ groups
│  │     │  │  │  │  │  │  ├─ role_create_params.py
│  │     │  │  │  │  │  │  ├─ role_create_response.py
│  │     │  │  │  │  │  │  ├─ role_delete_response.py
│  │     │  │  │  │  │  │  ├─ role_list_params.py
│  │     │  │  │  │  │  │  ├─ role_list_response.py
│  │     │  │  │  │  │  │  ├─ role_retrieve_response.py
│  │     │  │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  │  ├─ group_create_params.py
│  │     │  │  │  │  │  ├─ group_delete_response.py
│  │     │  │  │  │  │  ├─ group_list_params.py
│  │     │  │  │  │  │  ├─ group_retrieve_params.py
│  │     │  │  │  │  │  ├─ hosted_tool_permission_update_params.py
│  │     │  │  │  │  │  ├─ model_permission_update_params.py
│  │     │  │  │  │  │  ├─ project_api_key.py
│  │     │  │  │  │  │  ├─ project_data_retention.py
│  │     │  │  │  │  │  ├─ project_group.py
│  │     │  │  │  │  │  ├─ project_hosted_tool_permissions.py
│  │     │  │  │  │  │  ├─ project_model_permissions.py
│  │     │  │  │  │  │  ├─ project_model_permissions_deleted.py
│  │     │  │  │  │  │  ├─ project_rate_limit.py
│  │     │  │  │  │  │  ├─ project_service_account.py
│  │     │  │  │  │  │  ├─ project_spend_alert.py
│  │     │  │  │  │  │  ├─ project_spend_alert_deleted.py
│  │     │  │  │  │  │  ├─ project_spend_limit.py
│  │     │  │  │  │  │  ├─ project_spend_limit_deleted.py
│  │     │  │  │  │  │  ├─ project_user.py
│  │     │  │  │  │  │  ├─ rate_limit_list_rate_limits_params.py
│  │     │  │  │  │  │  ├─ rate_limit_update_rate_limit_params.py
│  │     │  │  │  │  │  ├─ role_create_params.py
│  │     │  │  │  │  │  ├─ role_delete_response.py
│  │     │  │  │  │  │  ├─ role_list_params.py
│  │     │  │  │  │  │  ├─ role_update_params.py
│  │     │  │  │  │  │  ├─ service_accounts
│  │     │  │  │  │  │  │  ├─ api_key_create_params.py
│  │     │  │  │  │  │  │  ├─ api_key_create_response.py
│  │     │  │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  │  ├─ service_account_create_params.py
│  │     │  │  │  │  │  ├─ service_account_create_response.py
│  │     │  │  │  │  │  ├─ service_account_delete_response.py
│  │     │  │  │  │  │  ├─ service_account_list_params.py
│  │     │  │  │  │  │  ├─ service_account_update_params.py
│  │     │  │  │  │  │  ├─ spend_alert_create_params.py
│  │     │  │  │  │  │  ├─ spend_alert_list_params.py
│  │     │  │  │  │  │  ├─ spend_alert_update_params.py
│  │     │  │  │  │  │  ├─ spend_limit_update_params.py
│  │     │  │  │  │  │  ├─ users
│  │     │  │  │  │  │  │  ├─ role_create_params.py
│  │     │  │  │  │  │  │  ├─ role_create_response.py
│  │     │  │  │  │  │  │  ├─ role_delete_response.py
│  │     │  │  │  │  │  │  ├─ role_list_params.py
│  │     │  │  │  │  │  │  ├─ role_list_response.py
│  │     │  │  │  │  │  │  ├─ role_retrieve_response.py
│  │     │  │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  │  ├─ user_create_params.py
│  │     │  │  │  │  │  ├─ user_delete_response.py
│  │     │  │  │  │  │  ├─ user_list_params.py
│  │     │  │  │  │  │  ├─ user_update_params.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ project_create_params.py
│  │     │  │  │  │  ├─ project_list_params.py
│  │     │  │  │  │  ├─ project_residency.py
│  │     │  │  │  │  ├─ project_update_params.py
│  │     │  │  │  │  ├─ role.py
│  │     │  │  │  │  ├─ role_create_params.py
│  │     │  │  │  │  ├─ role_delete_response.py
│  │     │  │  │  │  ├─ role_list_params.py
│  │     │  │  │  │  ├─ role_update_params.py
│  │     │  │  │  │  ├─ spend_alert_create_params.py
│  │     │  │  │  │  ├─ spend_alert_list_params.py
│  │     │  │  │  │  ├─ spend_alert_update_params.py
│  │     │  │  │  │  ├─ spend_limit_update_params.py
│  │     │  │  │  │  ├─ usage_audio_speeches_params.py
│  │     │  │  │  │  ├─ usage_audio_speeches_response.py
│  │     │  │  │  │  ├─ usage_audio_transcriptions_params.py
│  │     │  │  │  │  ├─ usage_audio_transcriptions_response.py
│  │     │  │  │  │  ├─ usage_code_interpreter_sessions_params.py
│  │     │  │  │  │  ├─ usage_code_interpreter_sessions_response.py
│  │     │  │  │  │  ├─ usage_completions_params.py
│  │     │  │  │  │  ├─ usage_completions_response.py
│  │     │  │  │  │  ├─ usage_costs_params.py
│  │     │  │  │  │  ├─ usage_costs_response.py
│  │     │  │  │  │  ├─ usage_embeddings_params.py
│  │     │  │  │  │  ├─ usage_embeddings_response.py
│  │     │  │  │  │  ├─ usage_file_search_calls_params.py
│  │     │  │  │  │  ├─ usage_file_search_calls_response.py
│  │     │  │  │  │  ├─ usage_images_params.py
│  │     │  │  │  │  ├─ usage_images_response.py
│  │     │  │  │  │  ├─ usage_moderations_params.py
│  │     │  │  │  │  ├─ usage_moderations_response.py
│  │     │  │  │  │  ├─ usage_vector_stores_params.py
│  │     │  │  │  │  ├─ usage_vector_stores_response.py
│  │     │  │  │  │  ├─ usage_web_search_calls_params.py
│  │     │  │  │  │  ├─ usage_web_search_calls_response.py
│  │     │  │  │  │  ├─ users
│  │     │  │  │  │  │  ├─ role_create_params.py
│  │     │  │  │  │  │  ├─ role_create_response.py
│  │     │  │  │  │  │  ├─ role_delete_response.py
│  │     │  │  │  │  │  ├─ role_list_params.py
│  │     │  │  │  │  │  ├─ role_list_response.py
│  │     │  │  │  │  │  ├─ role_retrieve_response.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ user_delete_response.py
│  │     │  │  │  │  ├─ user_list_params.py
│  │     │  │  │  │  ├─ user_update_params.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ audio
│  │     │  │  │  ├─ speech_create_params.py
│  │     │  │  │  ├─ speech_model.py
│  │     │  │  │  ├─ transcription.py
│  │     │  │  │  ├─ transcription_create_params.py
│  │     │  │  │  ├─ transcription_create_response.py
│  │     │  │  │  ├─ transcription_diarized.py
│  │     │  │  │  ├─ transcription_diarized_segment.py
│  │     │  │  │  ├─ transcription_include.py
│  │     │  │  │  ├─ transcription_language.py
│  │     │  │  │  ├─ transcription_segment.py
│  │     │  │  │  ├─ transcription_stream_event.py
│  │     │  │  │  ├─ transcription_text_delta_event.py
│  │     │  │  │  ├─ transcription_text_done_event.py
│  │     │  │  │  ├─ transcription_text_segment_event.py
│  │     │  │  │  ├─ transcription_verbose.py
│  │     │  │  │  ├─ transcription_word.py
│  │     │  │  │  ├─ translation.py
│  │     │  │  │  ├─ translation_create_params.py
│  │     │  │  │  ├─ translation_create_response.py
│  │     │  │  │  ├─ translation_verbose.py
│  │     │  │  │  ├─ voice.py
│  │     │  │  │  ├─ voice_create_params.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ audio_model.py
│  │     │  │  ├─ audio_response_format.py
│  │     │  │  ├─ auto_file_chunking_strategy_param.py
│  │     │  │  ├─ batch.py
│  │     │  │  ├─ batch_create_params.py
│  │     │  │  ├─ batch_error.py
│  │     │  │  ├─ batch_list_params.py
│  │     │  │  ├─ batch_request_counts.py
│  │     │  │  ├─ batch_usage.py
│  │     │  │  ├─ beta
│  │     │  │  │  ├─ agent.py
│  │     │  │  │  ├─ agents
│  │     │  │  │  │  ├─ environments
│  │     │  │  │  │  │  ├─ environment_file.py
│  │     │  │  │  │  │  ├─ environment_template.py
│  │     │  │  │  │  │  ├─ environment_template_deleted.py
│  │     │  │  │  │  │  ├─ file_create_params.py
│  │     │  │  │  │  │  ├─ file_list_params.py
│  │     │  │  │  │  │  ├─ template_create_params.py
│  │     │  │  │  │  │  ├─ template_list_params.py
│  │     │  │  │  │  │  ├─ template_update_params.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ environment_info.py
│  │     │  │  │  │  ├─ sessions
│  │     │  │  │  │  │  ├─ artifact_list_params.py
│  │     │  │  │  │  │  ├─ event_create_params.py
│  │     │  │  │  │  │  ├─ item_list_params.py
│  │     │  │  │  │  │  ├─ session_artifact.py
│  │     │  │  │  │  │  ├─ session_artifact_deleted.py
│  │     │  │  │  │  │  ├─ session_trace.py
│  │     │  │  │  │  │  ├─ subagents
│  │     │  │  │  │  │  │  ├─ item_list_params.py
│  │     │  │  │  │  │  │  ├─ turns
│  │     │  │  │  │  │  │  │  ├─ item_list_params.py
│  │     │  │  │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  │  │  ├─ turn_list_params.py
│  │     │  │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  │  ├─ subagent_list_params.py
│  │     │  │  │  │  │  ├─ trace_list_params.py
│  │     │  │  │  │  │  ├─ turn.py
│  │     │  │  │  │  │  ├─ turn_list_params.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ session_create_params.py
│  │     │  │  │  │  ├─ session_list_params.py
│  │     │  │  │  │  ├─ session_update_params.py
│  │     │  │  │  │  ├─ vault.py
│  │     │  │  │  │  ├─ vaults
│  │     │  │  │  │  │  ├─ credential.py
│  │     │  │  │  │  │  ├─ credential_auth.py
│  │     │  │  │  │  │  ├─ credential_auth_create_param.py
│  │     │  │  │  │  │  ├─ credential_auth_rotate_param.py
│  │     │  │  │  │  │  ├─ credential_create_params.py
│  │     │  │  │  │  │  ├─ credential_deleted.py
│  │     │  │  │  │  │  ├─ credential_list_params.py
│  │     │  │  │  │  │  ├─ credential_networking.py
│  │     │  │  │  │  │  ├─ credential_networking_param.py
│  │     │  │  │  │  │  ├─ credential_update_params.py
│  │     │  │  │  │  │  ├─ mcp_oauth_token_endpoint_auth.py
│  │     │  │  │  │  │  ├─ mcp_oauth_token_endpoint_auth_create_param.py
│  │     │  │  │  │  │  ├─ mcp_oauth_token_endpoint_auth_rotate_param.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ vault_create_params.py
│  │     │  │  │  │  ├─ vault_deleted.py
│  │     │  │  │  │  ├─ vault_list_params.py
│  │     │  │  │  │  ├─ vault_status.py
│  │     │  │  │  │  ├─ vault_status_filter_param.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ agent_browser_authentication_cancel_param.py
│  │     │  │  │  ├─ agent_browser_authentication_cancel_param_param.py
│  │     │  │  │  ├─ agent_browser_authentication_submit_param.py
│  │     │  │  │  ├─ agent_browser_authentication_submit_param_param.py
│  │     │  │  │  ├─ agent_browser_origin_access_param.py
│  │     │  │  │  ├─ agent_browser_origin_access_param_param.py
│  │     │  │  │  ├─ agent_close_subagent_call_item.py
│  │     │  │  │  ├─ agent_command_execution_item.py
│  │     │  │  │  ├─ agent_content.py
│  │     │  │  │  ├─ agent_create_params.py
│  │     │  │  │  ├─ agent_create_subagent_call_item.py
│  │     │  │  │  ├─ agent_deleted.py
│  │     │  │  │  ├─ agent_function_call_item.py
│  │     │  │  │  ├─ agent_function_call_output.py
│  │     │  │  │  ├─ agent_function_call_output_param.py
│  │     │  │  │  ├─ agent_function_call_status.py
│  │     │  │  │  ├─ agent_interrupt_subagent_call_item.py
│  │     │  │  │  ├─ agent_list_params.py
│  │     │  │  │  ├─ agent_mcp_call_item.py
│  │     │  │  │  ├─ agent_output_command_execution_output_delta_event.py
│  │     │  │  │  ├─ agent_output_item.py
│  │     │  │  │  ├─ agent_output_item_status.py
│  │     │  │  │  ├─ agent_reasoning.py
│  │     │  │  │  ├─ agent_reasoning_item.py
│  │     │  │  │  ├─ agent_reasoning_param.py
│  │     │  │  │  ├─ agent_resume_subagent_call_item.py
│  │     │  │  │  ├─ agent_send_subagent_input_call_item.py
│  │     │  │  │  ├─ agent_session.py
│  │     │  │  │  ├─ agent_session_assistant_message.py
│  │     │  │  │  ├─ agent_session_created_event.py
│  │     │  │  │  ├─ agent_session_deleted.py
│  │     │  │  │  ├─ agent_session_environment_connected_event.py
│  │     │  │  │  ├─ agent_session_environment_disconnected_event.py
│  │     │  │  │  ├─ agent_session_environment_failed_event.py
│  │     │  │  │  ├─ agent_session_environment_pending_event.py
│  │     │  │  │  ├─ agent_session_environment_ready_event.py
│  │     │  │  │  ├─ agent_session_environment_reset_event.py
│  │     │  │  │  ├─ agent_session_environment_state.py
│  │     │  │  │  ├─ agent_session_error_event.py
│  │     │  │  │  ├─ agent_session_event.py
│  │     │  │  │  ├─ agent_session_failed_event.py
│  │     │  │  │  ├─ agent_session_idle_event.py
│  │     │  │  │  ├─ agent_session_input_message_param.py
│  │     │  │  │  ├─ agent_session_input_param.py
│  │     │  │  │  ├─ agent_session_in_progress_event.py
│  │     │  │  │  ├─ agent_session_item.py
│  │     │  │  │  ├─ agent_session_message.py
│  │     │  │  │  ├─ agent_session_message_content.py
│  │     │  │  │  ├─ agent_session_requires_action_event.py
│  │     │  │  │  ├─ agent_session_subagent_active_event.py
│  │     │  │  │  ├─ agent_session_subagent_closed_event.py
│  │     │  │  │  ├─ agent_session_subagent_created_event.py
│  │     │  │  │  ├─ agent_session_turn_cancelled_event.py
│  │     │  │  │  ├─ agent_session_turn_completed_event.py
│  │     │  │  │  ├─ agent_session_turn_content_part_added_event.py
│  │     │  │  │  ├─ agent_session_turn_content_part_done_event.py
│  │     │  │  │  ├─ agent_session_turn_created_event.py
│  │     │  │  │  ├─ agent_session_turn_failed_event.py
│  │     │  │  │  ├─ agent_session_turn_in_progress_event.py
│  │     │  │  │  ├─ agent_session_turn_item_added_event.py
│  │     │  │  │  ├─ agent_session_turn_item_done_event.py
│  │     │  │  │  ├─ agent_session_turn_output_text_delta_event.py
│  │     │  │  │  ├─ agent_session_turn_output_text_done_event.py
│  │     │  │  │  ├─ agent_session_turn_reasoning_summary_part_added_event.py
│  │     │  │  │  ├─ agent_session_turn_reasoning_summary_part_done_event.py
│  │     │  │  │  ├─ agent_session_turn_reasoning_summary_text_delta_event.py
│  │     │  │  │  ├─ agent_session_turn_reasoning_summary_text_done_event.py
│  │     │  │  │  ├─ agent_text.py
│  │     │  │  │  ├─ agent_text_param.py
│  │     │  │  │  ├─ agent_tool.py
│  │     │  │  │  ├─ agent_tool_param.py
│  │     │  │  │  ├─ agent_update_params.py
│  │     │  │  │  ├─ agent_wait_for_subagents_call_item.py
│  │     │  │  │  ├─ agent_web_search_call_item.py
│  │     │  │  │  ├─ assistant.py
│  │     │  │  │  ├─ assistant_create_params.py
│  │     │  │  │  ├─ assistant_deleted.py
│  │     │  │  │  ├─ assistant_list_params.py
│  │     │  │  │  ├─ assistant_response_format_option.py
│  │     │  │  │  ├─ assistant_response_format_option_param.py
│  │     │  │  │  ├─ assistant_stream_event.py
│  │     │  │  │  ├─ assistant_tool.py
│  │     │  │  │  ├─ assistant_tool_choice.py
│  │     │  │  │  ├─ assistant_tool_choice_function.py
│  │     │  │  │  ├─ assistant_tool_choice_function_param.py
│  │     │  │  │  ├─ assistant_tool_choice_option.py
│  │     │  │  │  ├─ assistant_tool_choice_option_param.py
│  │     │  │  │  ├─ assistant_tool_choice_param.py
│  │     │  │  │  ├─ assistant_tool_param.py
│  │     │  │  │  ├─ assistant_update_params.py
│  │     │  │  │  ├─ beta_apply_patch_tool.py
│  │     │  │  │  ├─ beta_apply_patch_tool_param.py
│  │     │  │  │  ├─ beta_compacted_response.py
│  │     │  │  │  ├─ beta_computer_action.py
│  │     │  │  │  ├─ beta_computer_action_list.py
│  │     │  │  │  ├─ beta_computer_action_list_param.py
│  │     │  │  │  ├─ beta_computer_action_param.py
│  │     │  │  │  ├─ beta_computer_tool.py
│  │     │  │  │  ├─ beta_computer_tool_param.py
│  │     │  │  │  ├─ beta_computer_use_preview_tool.py
│  │     │  │  │  ├─ beta_computer_use_preview_tool_param.py
│  │     │  │  │  ├─ beta_container_auto.py
│  │     │  │  │  ├─ beta_container_auto_param.py
│  │     │  │  │  ├─ beta_container_network_policy_allowlist.py
│  │     │  │  │  ├─ beta_container_network_policy_allowlist_param.py
│  │     │  │  │  ├─ beta_container_network_policy_disabled.py
│  │     │  │  │  ├─ beta_container_network_policy_disabled_param.py
│  │     │  │  │  ├─ beta_container_network_policy_domain_secret.py
│  │     │  │  │  ├─ beta_container_network_policy_domain_secret_param.py
│  │     │  │  │  ├─ beta_container_reference.py
│  │     │  │  │  ├─ beta_container_reference_param.py
│  │     │  │  │  ├─ beta_custom_tool.py
│  │     │  │  │  ├─ beta_custom_tool_param.py
│  │     │  │  │  ├─ beta_easy_input_message.py
│  │     │  │  │  ├─ beta_easy_input_message_param.py
│  │     │  │  │  ├─ beta_file_search_tool.py
│  │     │  │  │  ├─ beta_file_search_tool_param.py
│  │     │  │  │  ├─ beta_function_shell_tool.py
│  │     │  │  │  ├─ beta_function_shell_tool_param.py
│  │     │  │  │  ├─ beta_function_tool.py
│  │     │  │  │  ├─ beta_function_tool_param.py
│  │     │  │  │  ├─ beta_image_detail.py
│  │     │  │  │  ├─ beta_inline_skill.py
│  │     │  │  │  ├─ beta_inline_skill_param.py
│  │     │  │  │  ├─ beta_inline_skill_source.py
│  │     │  │  │  ├─ beta_inline_skill_source_param.py
│  │     │  │  │  ├─ beta_local_environment.py
│  │     │  │  │  ├─ beta_local_environment_param.py
│  │     │  │  │  ├─ beta_local_skill.py
│  │     │  │  │  ├─ beta_local_skill_param.py
│  │     │  │  │  ├─ beta_mcp_tool_call_error.py
│  │     │  │  │  ├─ beta_mcp_tool_call_error_param.py
│  │     │  │  │  ├─ beta_namespace_tool.py
│  │     │  │  │  ├─ beta_namespace_tool_param.py
│  │     │  │  │  ├─ beta_response.py
│  │     │  │  │  ├─ beta_responses_client_event.py
│  │     │  │  │  ├─ beta_responses_client_event_param.py
│  │     │  │  │  ├─ beta_responses_server_event.py
│  │     │  │  │  ├─ beta_response_apply_patch_tool_call.py
│  │     │  │  │  ├─ beta_response_apply_patch_tool_call_output.py
│  │     │  │  │  ├─ beta_response_audio_delta_event.py
│  │     │  │  │  ├─ beta_response_audio_done_event.py
│  │     │  │  │  ├─ beta_response_audio_transcript_delta_event.py
│  │     │  │  │  ├─ beta_response_audio_transcript_done_event.py
│  │     │  │  │  ├─ beta_response_code_interpreter_call_code_delta_event.py
│  │     │  │  │  ├─ beta_response_code_interpreter_call_code_done_event.py
│  │     │  │  │  ├─ beta_response_code_interpreter_call_completed_event.py
│  │     │  │  │  ├─ beta_response_code_interpreter_call_interpreting_event.py
│  │     │  │  │  ├─ beta_response_code_interpreter_call_in_progress_event.py
│  │     │  │  │  ├─ beta_response_code_interpreter_tool_call.py
│  │     │  │  │  ├─ beta_response_code_interpreter_tool_call_param.py
│  │     │  │  │  ├─ beta_response_compaction_compacting_event.py
│  │     │  │  │  ├─ beta_response_compaction_item.py
│  │     │  │  │  ├─ beta_response_compaction_item_param.py
│  │     │  │  │  ├─ beta_response_compaction_item_param_param.py
│  │     │  │  │  ├─ beta_response_completed_event.py
│  │     │  │  │  ├─ beta_response_computer_tool_call.py
│  │     │  │  │  ├─ beta_response_computer_tool_call_output_item.py
│  │     │  │  │  ├─ beta_response_computer_tool_call_output_screenshot.py
│  │     │  │  │  ├─ beta_response_computer_tool_call_output_screenshot_param.py
│  │     │  │  │  ├─ beta_response_computer_tool_call_param.py
│  │     │  │  │  ├─ beta_response_configuration_update_item.py
│  │     │  │  │  ├─ beta_response_configuration_update_item_param.py
│  │     │  │  │  ├─ beta_response_configuration_update_item_param_param.py
│  │     │  │  │  ├─ beta_response_container_reference.py
│  │     │  │  │  ├─ beta_response_content_part_added_event.py
│  │     │  │  │  ├─ beta_response_content_part_done_event.py
│  │     │  │  │  ├─ beta_response_conversation_param.py
│  │     │  │  │  ├─ beta_response_conversation_param_param.py
│  │     │  │  │  ├─ beta_response_created_event.py
│  │     │  │  │  ├─ beta_response_custom_tool_call.py
│  │     │  │  │  ├─ beta_response_custom_tool_call_input_delta_event.py
│  │     │  │  │  ├─ beta_response_custom_tool_call_input_done_event.py
│  │     │  │  │  ├─ beta_response_custom_tool_call_item.py
│  │     │  │  │  ├─ beta_response_custom_tool_call_output.py
│  │     │  │  │  ├─ beta_response_custom_tool_call_output_item.py
│  │     │  │  │  ├─ beta_response_custom_tool_call_output_param.py
│  │     │  │  │  ├─ beta_response_custom_tool_call_param.py
│  │     │  │  │  ├─ beta_response_error.py
│  │     │  │  │  ├─ beta_response_error_event.py
│  │     │  │  │  ├─ beta_response_failed_event.py
│  │     │  │  │  ├─ beta_response_file_search_call_completed_event.py
│  │     │  │  │  ├─ beta_response_file_search_call_in_progress_event.py
│  │     │  │  │  ├─ beta_response_file_search_call_searching_event.py
│  │     │  │  │  ├─ beta_response_file_search_tool_call.py
│  │     │  │  │  ├─ beta_response_file_search_tool_call_param.py
│  │     │  │  │  ├─ beta_response_format_text_config.py
│  │     │  │  │  ├─ beta_response_format_text_config_param.py
│  │     │  │  │  ├─ beta_response_format_text_json_schema_config.py
│  │     │  │  │  ├─ beta_response_format_text_json_schema_config_param.py
│  │     │  │  │  ├─ beta_response_function_call_arguments_delta_event.py
│  │     │  │  │  ├─ beta_response_function_call_arguments_done_event.py
│  │     │  │  │  ├─ beta_response_function_call_output_item.py
│  │     │  │  │  ├─ beta_response_function_call_output_item_list.py
│  │     │  │  │  ├─ beta_response_function_call_output_item_list_param.py
│  │     │  │  │  ├─ beta_response_function_call_output_item_param.py
│  │     │  │  │  ├─ beta_response_function_shell_call_output_content.py
│  │     │  │  │  ├─ beta_response_function_shell_call_output_content_param.py
│  │     │  │  │  ├─ beta_response_function_shell_tool_call.py
│  │     │  │  │  ├─ beta_response_function_shell_tool_call_output.py
│  │     │  │  │  ├─ beta_response_function_tool_call.py
│  │     │  │  │  ├─ beta_response_function_tool_call_item.py
│  │     │  │  │  ├─ beta_response_function_tool_call_output_item.py
│  │     │  │  │  ├─ beta_response_function_tool_call_param.py
│  │     │  │  │  ├─ beta_response_function_web_search.py
│  │     │  │  │  ├─ beta_response_function_web_search_param.py
│  │     │  │  │  ├─ beta_response_image_gen_call_completed_event.py
│  │     │  │  │  ├─ beta_response_image_gen_call_generating_event.py
│  │     │  │  │  ├─ beta_response_image_gen_call_in_progress_event.py
│  │     │  │  │  ├─ beta_response_image_gen_call_partial_image_event.py
│  │     │  │  │  ├─ beta_response_includable.py
│  │     │  │  │  ├─ beta_response_incomplete_event.py
│  │     │  │  │  ├─ beta_response_inject_created_event.py
│  │     │  │  │  ├─ beta_response_inject_event.py
│  │     │  │  │  ├─ beta_response_inject_event_param.py
│  │     │  │  │  ├─ beta_response_inject_failed_event.py
│  │     │  │  │  ├─ beta_response_input.py
│  │     │  │  │  ├─ beta_response_input_content.py
│  │     │  │  │  ├─ beta_response_input_content_param.py
│  │     │  │  │  ├─ beta_response_input_file.py
│  │     │  │  │  ├─ beta_response_input_file_content.py
│  │     │  │  │  ├─ beta_response_input_file_content_param.py
│  │     │  │  │  ├─ beta_response_input_file_param.py
│  │     │  │  │  ├─ beta_response_input_image.py
│  │     │  │  │  ├─ beta_response_input_image_content.py
│  │     │  │  │  ├─ beta_response_input_image_content_param.py
│  │     │  │  │  ├─ beta_response_input_image_param.py
│  │     │  │  │  ├─ beta_response_input_item.py
│  │     │  │  │  ├─ beta_response_input_item_param.py
│  │     │  │  │  ├─ beta_response_input_message_content_list.py
│  │     │  │  │  ├─ beta_response_input_message_content_list_param.py
│  │     │  │  │  ├─ beta_response_input_message_item.py
│  │     │  │  │  ├─ beta_response_input_param.py
│  │     │  │  │  ├─ beta_response_input_text.py
│  │     │  │  │  ├─ beta_response_input_text_content.py
│  │     │  │  │  ├─ beta_response_input_text_content_param.py
│  │     │  │  │  ├─ beta_response_input_text_param.py
│  │     │  │  │  ├─ beta_response_in_progress_event.py
│  │     │  │  │  ├─ beta_response_item.py
│  │     │  │  │  ├─ beta_response_local_environment.py
│  │     │  │  │  ├─ beta_response_mcp_call_arguments_delta_event.py
│  │     │  │  │  ├─ beta_response_mcp_call_arguments_done_event.py
│  │     │  │  │  ├─ beta_response_mcp_call_completed_event.py
│  │     │  │  │  ├─ beta_response_mcp_call_failed_event.py
│  │     │  │  │  ├─ beta_response_mcp_call_in_progress_event.py
│  │     │  │  │  ├─ beta_response_mcp_list_tools_completed_event.py
│  │     │  │  │  ├─ beta_response_mcp_list_tools_failed_event.py
│  │     │  │  │  ├─ beta_response_mcp_list_tools_in_progress_event.py
│  │     │  │  │  ├─ beta_response_output_item.py
│  │     │  │  │  ├─ beta_response_output_item_added_event.py
│  │     │  │  │  ├─ beta_response_output_item_done_event.py
│  │     │  │  │  ├─ beta_response_output_message.py
│  │     │  │  │  ├─ beta_response_output_message_param.py
│  │     │  │  │  ├─ beta_response_output_refusal.py
│  │     │  │  │  ├─ beta_response_output_refusal_param.py
│  │     │  │  │  ├─ beta_response_output_text.py
│  │     │  │  │  ├─ beta_response_output_text_annotation_added_event.py
│  │     │  │  │  ├─ beta_response_output_text_param.py
│  │     │  │  │  ├─ beta_response_prompt.py
│  │     │  │  │  ├─ beta_response_prompt_param.py
│  │     │  │  │  ├─ beta_response_queued_event.py
│  │     │  │  │  ├─ beta_response_reasoning_item.py
│  │     │  │  │  ├─ beta_response_reasoning_item_param.py
│  │     │  │  │  ├─ beta_response_reasoning_summary_part_added_event.py
│  │     │  │  │  ├─ beta_response_reasoning_summary_part_done_event.py
│  │     │  │  │  ├─ beta_response_reasoning_summary_text_delta_event.py
│  │     │  │  │  ├─ beta_response_reasoning_summary_text_done_event.py
│  │     │  │  │  ├─ beta_response_reasoning_text_delta_event.py
│  │     │  │  │  ├─ beta_response_reasoning_text_done_event.py
│  │     │  │  │  ├─ beta_response_refusal_delta_event.py
│  │     │  │  │  ├─ beta_response_refusal_done_event.py
│  │     │  │  │  ├─ beta_response_shell_call_command_added_event.py
│  │     │  │  │  ├─ beta_response_shell_call_command_delta_event.py
│  │     │  │  │  ├─ beta_response_shell_call_command_done_event.py
│  │     │  │  │  ├─ beta_response_shell_call_output_content_delta_event.py
│  │     │  │  │  ├─ beta_response_shell_call_output_content_done_event.py
│  │     │  │  │  ├─ beta_response_status.py
│  │     │  │  │  ├─ beta_response_steer_accepted_event.py
│  │     │  │  │  ├─ beta_response_steer_error_code.py
│  │     │  │  │  ├─ beta_response_steer_event.py
│  │     │  │  │  ├─ beta_response_steer_event_param.py
│  │     │  │  │  ├─ beta_response_steer_failed_event.py
│  │     │  │  │  ├─ beta_response_steer_input.py
│  │     │  │  │  ├─ beta_response_steer_input_content.py
│  │     │  │  │  ├─ beta_response_steer_input_content_param.py
│  │     │  │  │  ├─ beta_response_steer_input_param.py
│  │     │  │  │  ├─ beta_response_steer_pending_event.py
│  │     │  │  │  ├─ beta_response_steer_pending_reason.py
│  │     │  │  │  ├─ beta_response_steer_required_input.py
│  │     │  │  │  ├─ beta_response_stream_event.py
│  │     │  │  │  ├─ beta_response_text_config.py
│  │     │  │  │  ├─ beta_response_text_config_param.py
│  │     │  │  │  ├─ beta_response_text_delta_event.py
│  │     │  │  │  ├─ beta_response_text_done_event.py
│  │     │  │  │  ├─ beta_response_tool_search_call.py
│  │     │  │  │  ├─ beta_response_tool_search_output_item.py
│  │     │  │  │  ├─ beta_response_tool_search_output_item_param.py
│  │     │  │  │  ├─ beta_response_tool_search_output_item_param_param.py
│  │     │  │  │  ├─ beta_response_usage.py
│  │     │  │  │  ├─ beta_response_web_search_call_completed_event.py
│  │     │  │  │  ├─ beta_response_web_search_call_in_progress_event.py
│  │     │  │  │  ├─ beta_response_web_search_call_searching_event.py
│  │     │  │  │  ├─ beta_service_tier.py
│  │     │  │  │  ├─ beta_skill_reference.py
│  │     │  │  │  ├─ beta_skill_reference_param.py
│  │     │  │  │  ├─ beta_tool.py
│  │     │  │  │  ├─ beta_tool_choice_allowed.py
│  │     │  │  │  ├─ beta_tool_choice_allowed_param.py
│  │     │  │  │  ├─ beta_tool_choice_apply_patch.py
│  │     │  │  │  ├─ beta_tool_choice_apply_patch_param.py
│  │     │  │  │  ├─ beta_tool_choice_custom.py
│  │     │  │  │  ├─ beta_tool_choice_custom_param.py
│  │     │  │  │  ├─ beta_tool_choice_function.py
│  │     │  │  │  ├─ beta_tool_choice_function_param.py
│  │     │  │  │  ├─ beta_tool_choice_mcp.py
│  │     │  │  │  ├─ beta_tool_choice_mcp_param.py
│  │     │  │  │  ├─ beta_tool_choice_options.py
│  │     │  │  │  ├─ beta_tool_choice_shell.py
│  │     │  │  │  ├─ beta_tool_choice_shell_param.py
│  │     │  │  │  ├─ beta_tool_choice_types.py
│  │     │  │  │  ├─ beta_tool_choice_types_param.py
│  │     │  │  │  ├─ beta_tool_param.py
│  │     │  │  │  ├─ beta_tool_search_tool.py
│  │     │  │  │  ├─ beta_tool_search_tool_param.py
│  │     │  │  │  ├─ beta_web_search_preview_tool.py
│  │     │  │  │  ├─ beta_web_search_preview_tool_param.py
│  │     │  │  │  ├─ beta_web_search_tool.py
│  │     │  │  │  ├─ beta_web_search_tool_param.py
│  │     │  │  │  ├─ chat
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ chatkit
│  │     │  │  │  │  ├─ chatkit_attachment.py
│  │     │  │  │  │  ├─ chatkit_response_output_text.py
│  │     │  │  │  │  ├─ chatkit_thread.py
│  │     │  │  │  │  ├─ chatkit_thread_assistant_message_item.py
│  │     │  │  │  │  ├─ chatkit_thread_item_list.py
│  │     │  │  │  │  ├─ chatkit_thread_user_message_item.py
│  │     │  │  │  │  ├─ chatkit_widget_item.py
│  │     │  │  │  │  ├─ chat_session.py
│  │     │  │  │  │  ├─ chat_session_automatic_thread_titling.py
│  │     │  │  │  │  ├─ chat_session_chatkit_configuration.py
│  │     │  │  │  │  ├─ chat_session_chatkit_configuration_param.py
│  │     │  │  │  │  ├─ chat_session_expires_after_param.py
│  │     │  │  │  │  ├─ chat_session_file_upload.py
│  │     │  │  │  │  ├─ chat_session_history.py
│  │     │  │  │  │  ├─ chat_session_rate_limits.py
│  │     │  │  │  │  ├─ chat_session_rate_limits_param.py
│  │     │  │  │  │  ├─ chat_session_status.py
│  │     │  │  │  │  ├─ chat_session_workflow_param.py
│  │     │  │  │  │  ├─ session_create_params.py
│  │     │  │  │  │  ├─ thread_delete_response.py
│  │     │  │  │  │  ├─ thread_list_items_params.py
│  │     │  │  │  │  ├─ thread_list_params.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ chatkit_workflow.py
│  │     │  │  │  ├─ code_interpreter_tool.py
│  │     │  │  │  ├─ code_interpreter_tool_param.py
│  │     │  │  │  ├─ environment.py
│  │     │  │  │  ├─ environment_param.py
│  │     │  │  │  ├─ file_search_tool.py
│  │     │  │  │  ├─ file_search_tool_param.py
│  │     │  │  │  ├─ function_tool.py
│  │     │  │  │  ├─ function_tool_param.py
│  │     │  │  │  ├─ hosted_environment_file.py
│  │     │  │  │  ├─ hosted_environment_file_id.py
│  │     │  │  │  ├─ hosted_environment_file_param.py
│  │     │  │  │  ├─ hosted_plugin.py
│  │     │  │  │  ├─ hosted_plugin_param.py
│  │     │  │  │  ├─ hosted_skill.py
│  │     │  │  │  ├─ hosted_skill_param.py
│  │     │  │  │  ├─ hosted_skill_reference.py
│  │     │  │  │  ├─ inline_capability_source_param.py
│  │     │  │  │  ├─ input_content.py
│  │     │  │  │  ├─ input_content_param.py
│  │     │  │  │  ├─ mcp_transport.py
│  │     │  │  │  ├─ mcp_transport_param.py
│  │     │  │  │  ├─ multi_agent_config.py
│  │     │  │  │  ├─ multi_agent_config_param.py
│  │     │  │  │  ├─ output_text.py
│  │     │  │  │  ├─ persisted_agent_tool.py
│  │     │  │  │  ├─ persisted_agent_tool_param.py
│  │     │  │  │  ├─ persisted_mcp_transport.py
│  │     │  │  │  ├─ persisted_mcp_transport_param.py
│  │     │  │  │  ├─ realtime
│  │     │  │  │  │  ├─ conversation_created_event.py
│  │     │  │  │  │  ├─ conversation_item.py
│  │     │  │  │  │  ├─ conversation_item_content.py
│  │     │  │  │  │  ├─ conversation_item_content_param.py
│  │     │  │  │  │  ├─ conversation_item_created_event.py
│  │     │  │  │  │  ├─ conversation_item_create_event.py
│  │     │  │  │  │  ├─ conversation_item_create_event_param.py
│  │     │  │  │  │  ├─ conversation_item_deleted_event.py
│  │     │  │  │  │  ├─ conversation_item_delete_event.py
│  │     │  │  │  │  ├─ conversation_item_delete_event_param.py
│  │     │  │  │  │  ├─ conversation_item_input_audio_transcription_completed_event.py
│  │     │  │  │  │  ├─ conversation_item_input_audio_transcription_delta_event.py
│  │     │  │  │  │  ├─ conversation_item_input_audio_transcription_failed_event.py
│  │     │  │  │  │  ├─ conversation_item_param.py
│  │     │  │  │  │  ├─ conversation_item_retrieve_event.py
│  │     │  │  │  │  ├─ conversation_item_retrieve_event_param.py
│  │     │  │  │  │  ├─ conversation_item_truncated_event.py
│  │     │  │  │  │  ├─ conversation_item_truncate_event.py
│  │     │  │  │  │  ├─ conversation_item_truncate_event_param.py
│  │     │  │  │  │  ├─ conversation_item_with_reference.py
│  │     │  │  │  │  ├─ conversation_item_with_reference_param.py
│  │     │  │  │  │  ├─ error_event.py
│  │     │  │  │  │  ├─ input_audio_buffer_append_event.py
│  │     │  │  │  │  ├─ input_audio_buffer_append_event_param.py
│  │     │  │  │  │  ├─ input_audio_buffer_cleared_event.py
│  │     │  │  │  │  ├─ input_audio_buffer_clear_event.py
│  │     │  │  │  │  ├─ input_audio_buffer_clear_event_param.py
│  │     │  │  │  │  ├─ input_audio_buffer_committed_event.py
│  │     │  │  │  │  ├─ input_audio_buffer_commit_event.py
│  │     │  │  │  │  ├─ input_audio_buffer_commit_event_param.py
│  │     │  │  │  │  ├─ input_audio_buffer_speech_started_event.py
│  │     │  │  │  │  ├─ input_audio_buffer_speech_stopped_event.py
│  │     │  │  │  │  ├─ rate_limits_updated_event.py
│  │     │  │  │  │  ├─ realtime_client_event.py
│  │     │  │  │  │  ├─ realtime_client_event_param.py
│  │     │  │  │  │  ├─ realtime_connect_params.py
│  │     │  │  │  │  ├─ realtime_response.py
│  │     │  │  │  │  ├─ realtime_response_status.py
│  │     │  │  │  │  ├─ realtime_response_usage.py
│  │     │  │  │  │  ├─ realtime_server_event.py
│  │     │  │  │  │  ├─ response_audio_delta_event.py
│  │     │  │  │  │  ├─ response_audio_done_event.py
│  │     │  │  │  │  ├─ response_audio_transcript_delta_event.py
│  │     │  │  │  │  ├─ response_audio_transcript_done_event.py
│  │     │  │  │  │  ├─ response_cancel_event.py
│  │     │  │  │  │  ├─ response_cancel_event_param.py
│  │     │  │  │  │  ├─ response_content_part_added_event.py
│  │     │  │  │  │  ├─ response_content_part_done_event.py
│  │     │  │  │  │  ├─ response_created_event.py
│  │     │  │  │  │  ├─ response_create_event.py
│  │     │  │  │  │  ├─ response_create_event_param.py
│  │     │  │  │  │  ├─ response_done_event.py
│  │     │  │  │  │  ├─ response_function_call_arguments_delta_event.py
│  │     │  │  │  │  ├─ response_function_call_arguments_done_event.py
│  │     │  │  │  │  ├─ response_output_item_added_event.py
│  │     │  │  │  │  ├─ response_output_item_done_event.py
│  │     │  │  │  │  ├─ response_text_delta_event.py
│  │     │  │  │  │  ├─ response_text_done_event.py
│  │     │  │  │  │  ├─ session.py
│  │     │  │  │  │  ├─ session_created_event.py
│  │     │  │  │  │  ├─ session_create_params.py
│  │     │  │  │  │  ├─ session_create_response.py
│  │     │  │  │  │  ├─ session_updated_event.py
│  │     │  │  │  │  ├─ session_update_event.py
│  │     │  │  │  │  ├─ session_update_event_param.py
│  │     │  │  │  │  ├─ transcription_session.py
│  │     │  │  │  │  ├─ transcription_session_create_params.py
│  │     │  │  │  │  ├─ transcription_session_update.py
│  │     │  │  │  │  ├─ transcription_session_updated_event.py
│  │     │  │  │  │  ├─ transcription_session_update_param.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ responses
│  │     │  │  │  │  ├─ beta_response_item_list.py
│  │     │  │  │  │  ├─ input_item_list_params.py
│  │     │  │  │  │  ├─ input_token_count_params.py
│  │     │  │  │  │  ├─ input_token_count_response.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ response_compact_params.py
│  │     │  │  │  ├─ response_create_params.py
│  │     │  │  │  ├─ response_retrieve_params.py
│  │     │  │  │  ├─ session_error.py
│  │     │  │  │  ├─ session_turn_error.py
│  │     │  │  │  ├─ setup_command_param.py
│  │     │  │  │  ├─ subagent.py
│  │     │  │  │  ├─ summary_text.py
│  │     │  │  │  ├─ text_format.py
│  │     │  │  │  ├─ text_format_param.py
│  │     │  │  │  ├─ thread.py
│  │     │  │  │  ├─ threads
│  │     │  │  │  │  ├─ annotation.py
│  │     │  │  │  │  ├─ annotation_delta.py
│  │     │  │  │  │  ├─ file_citation_annotation.py
│  │     │  │  │  │  ├─ file_citation_delta_annotation.py
│  │     │  │  │  │  ├─ file_path_annotation.py
│  │     │  │  │  │  ├─ file_path_delta_annotation.py
│  │     │  │  │  │  ├─ image_file.py
│  │     │  │  │  │  ├─ image_file_content_block.py
│  │     │  │  │  │  ├─ image_file_content_block_param.py
│  │     │  │  │  │  ├─ image_file_delta.py
│  │     │  │  │  │  ├─ image_file_delta_block.py
│  │     │  │  │  │  ├─ image_file_param.py
│  │     │  │  │  │  ├─ image_url.py
│  │     │  │  │  │  ├─ image_url_content_block.py
│  │     │  │  │  │  ├─ image_url_content_block_param.py
│  │     │  │  │  │  ├─ image_url_delta.py
│  │     │  │  │  │  ├─ image_url_delta_block.py
│  │     │  │  │  │  ├─ image_url_param.py
│  │     │  │  │  │  ├─ message.py
│  │     │  │  │  │  ├─ message_content.py
│  │     │  │  │  │  ├─ message_content_delta.py
│  │     │  │  │  │  ├─ message_content_part_param.py
│  │     │  │  │  │  ├─ message_create_params.py
│  │     │  │  │  │  ├─ message_deleted.py
│  │     │  │  │  │  ├─ message_delta.py
│  │     │  │  │  │  ├─ message_delta_event.py
│  │     │  │  │  │  ├─ message_list_params.py
│  │     │  │  │  │  ├─ message_update_params.py
│  │     │  │  │  │  ├─ refusal_content_block.py
│  │     │  │  │  │  ├─ refusal_delta_block.py
│  │     │  │  │  │  ├─ required_action_function_tool_call.py
│  │     │  │  │  │  ├─ run.py
│  │     │  │  │  │  ├─ runs
│  │     │  │  │  │  │  ├─ code_interpreter_logs.py
│  │     │  │  │  │  │  ├─ code_interpreter_output_image.py
│  │     │  │  │  │  │  ├─ code_interpreter_tool_call.py
│  │     │  │  │  │  │  ├─ code_interpreter_tool_call_delta.py
│  │     │  │  │  │  │  ├─ file_search_tool_call.py
│  │     │  │  │  │  │  ├─ file_search_tool_call_delta.py
│  │     │  │  │  │  │  ├─ function_tool_call.py
│  │     │  │  │  │  │  ├─ function_tool_call_delta.py
│  │     │  │  │  │  │  ├─ message_creation_step_details.py
│  │     │  │  │  │  │  ├─ run_step.py
│  │     │  │  │  │  │  ├─ run_step_delta.py
│  │     │  │  │  │  │  ├─ run_step_delta_event.py
│  │     │  │  │  │  │  ├─ run_step_delta_message_delta.py
│  │     │  │  │  │  │  ├─ run_step_include.py
│  │     │  │  │  │  │  ├─ step_list_params.py
│  │     │  │  │  │  │  ├─ step_retrieve_params.py
│  │     │  │  │  │  │  ├─ tool_call.py
│  │     │  │  │  │  │  ├─ tool_calls_step_details.py
│  │     │  │  │  │  │  ├─ tool_call_delta.py
│  │     │  │  │  │  │  ├─ tool_call_delta_object.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ run_create_params.py
│  │     │  │  │  │  ├─ run_list_params.py
│  │     │  │  │  │  ├─ run_status.py
│  │     │  │  │  │  ├─ run_submit_tool_outputs_params.py
│  │     │  │  │  │  ├─ run_update_params.py
│  │     │  │  │  │  ├─ text.py
│  │     │  │  │  │  ├─ text_content_block.py
│  │     │  │  │  │  ├─ text_content_block_param.py
│  │     │  │  │  │  ├─ text_delta.py
│  │     │  │  │  │  ├─ text_delta_block.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ thread_create_and_run_params.py
│  │     │  │  │  ├─ thread_create_params.py
│  │     │  │  │  ├─ thread_deleted.py
│  │     │  │  │  ├─ thread_update_params.py
│  │     │  │  │  ├─ token_usage.py
│  │     │  │  │  ├─ web_search_action.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ chat
│  │     │  │  │  ├─ chat_completion.py
│  │     │  │  │  ├─ chat_completion_allowed_tools_param.py
│  │     │  │  │  ├─ chat_completion_allowed_tool_choice_param.py
│  │     │  │  │  ├─ chat_completion_assistant_message_param.py
│  │     │  │  │  ├─ chat_completion_audio.py
│  │     │  │  │  ├─ chat_completion_audio_param.py
│  │     │  │  │  ├─ chat_completion_chunk.py
│  │     │  │  │  ├─ chat_completion_content_part_image.py
│  │     │  │  │  ├─ chat_completion_content_part_image_param.py
│  │     │  │  │  ├─ chat_completion_content_part_input_audio_param.py
│  │     │  │  │  ├─ chat_completion_content_part_param.py
│  │     │  │  │  ├─ chat_completion_content_part_refusal_param.py
│  │     │  │  │  ├─ chat_completion_content_part_text.py
│  │     │  │  │  ├─ chat_completion_content_part_text_param.py
│  │     │  │  │  ├─ chat_completion_custom_tool_param.py
│  │     │  │  │  ├─ chat_completion_deleted.py
│  │     │  │  │  ├─ chat_completion_developer_message_param.py
│  │     │  │  │  ├─ chat_completion_function_call_option_param.py
│  │     │  │  │  ├─ chat_completion_function_message_param.py
│  │     │  │  │  ├─ chat_completion_function_tool.py
│  │     │  │  │  ├─ chat_completion_function_tool_param.py
│  │     │  │  │  ├─ chat_completion_message.py
│  │     │  │  │  ├─ chat_completion_message_custom_tool_call.py
│  │     │  │  │  ├─ chat_completion_message_custom_tool_call_param.py
│  │     │  │  │  ├─ chat_completion_message_function_tool_call.py
│  │     │  │  │  ├─ chat_completion_message_function_tool_call_param.py
│  │     │  │  │  ├─ chat_completion_message_param.py
│  │     │  │  │  ├─ chat_completion_message_tool_call.py
│  │     │  │  │  ├─ chat_completion_message_tool_call_param.py
│  │     │  │  │  ├─ chat_completion_message_tool_call_union_param.py
│  │     │  │  │  ├─ chat_completion_modality.py
│  │     │  │  │  ├─ chat_completion_named_tool_choice_custom_param.py
│  │     │  │  │  ├─ chat_completion_named_tool_choice_param.py
│  │     │  │  │  ├─ chat_completion_prediction_content_param.py
│  │     │  │  │  ├─ chat_completion_reasoning_effort.py
│  │     │  │  │  ├─ chat_completion_role.py
│  │     │  │  │  ├─ chat_completion_store_message.py
│  │     │  │  │  ├─ chat_completion_stream_options_param.py
│  │     │  │  │  ├─ chat_completion_system_message_param.py
│  │     │  │  │  ├─ chat_completion_token_logprob.py
│  │     │  │  │  ├─ chat_completion_tool_choice_option_param.py
│  │     │  │  │  ├─ chat_completion_tool_message_param.py
│  │     │  │  │  ├─ chat_completion_tool_param.py
│  │     │  │  │  ├─ chat_completion_tool_union_param.py
│  │     │  │  │  ├─ chat_completion_user_message_param.py
│  │     │  │  │  ├─ completions
│  │     │  │  │  │  ├─ message_list_params.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ completion_create_params.py
│  │     │  │  │  ├─ completion_list_params.py
│  │     │  │  │  ├─ completion_update_params.py
│  │     │  │  │  ├─ parsed_chat_completion.py
│  │     │  │  │  ├─ parsed_function_tool_call.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ chat_model.py
│  │     │  │  ├─ completion.py
│  │     │  │  ├─ completion_choice.py
│  │     │  │  ├─ completion_create_params.py
│  │     │  │  ├─ completion_usage.py
│  │     │  │  ├─ containers
│  │     │  │  │  ├─ files
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ file_create_params.py
│  │     │  │  │  ├─ file_create_response.py
│  │     │  │  │  ├─ file_list_params.py
│  │     │  │  │  ├─ file_list_response.py
│  │     │  │  │  ├─ file_retrieve_response.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ container_create_params.py
│  │     │  │  ├─ container_create_response.py
│  │     │  │  ├─ container_list_params.py
│  │     │  │  ├─ container_list_response.py
│  │     │  │  ├─ container_retrieve_response.py
│  │     │  │  ├─ content_provenance_check.py
│  │     │  │  ├─ content_provenance_check_create_params.py
│  │     │  │  ├─ conversations
│  │     │  │  │  ├─ computer_screenshot_content.py
│  │     │  │  │  ├─ conversation.py
│  │     │  │  │  ├─ conversation_create_params.py
│  │     │  │  │  ├─ conversation_deleted_resource.py
│  │     │  │  │  ├─ conversation_item.py
│  │     │  │  │  ├─ conversation_item_list.py
│  │     │  │  │  ├─ conversation_update_params.py
│  │     │  │  │  ├─ input_file_content.py
│  │     │  │  │  ├─ input_file_content_param.py
│  │     │  │  │  ├─ input_image_content.py
│  │     │  │  │  ├─ input_image_content_param.py
│  │     │  │  │  ├─ input_text_content.py
│  │     │  │  │  ├─ input_text_content_param.py
│  │     │  │  │  ├─ item_create_params.py
│  │     │  │  │  ├─ item_list_params.py
│  │     │  │  │  ├─ item_retrieve_params.py
│  │     │  │  │  ├─ message.py
│  │     │  │  │  ├─ output_text_content.py
│  │     │  │  │  ├─ output_text_content_param.py
│  │     │  │  │  ├─ refusal_content.py
│  │     │  │  │  ├─ refusal_content_param.py
│  │     │  │  │  ├─ summary_text_content.py
│  │     │  │  │  ├─ text_content.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ create_embedding_response.py
│  │     │  │  ├─ deleted_skill.py
│  │     │  │  ├─ embedding.py
│  │     │  │  ├─ embedding_create_params.py
│  │     │  │  ├─ embedding_model.py
│  │     │  │  ├─ evals
│  │     │  │  │  ├─ create_eval_completions_run_data_source.py
│  │     │  │  │  ├─ create_eval_completions_run_data_source_param.py
│  │     │  │  │  ├─ create_eval_jsonl_run_data_source.py
│  │     │  │  │  ├─ create_eval_jsonl_run_data_source_param.py
│  │     │  │  │  ├─ eval_api_error.py
│  │     │  │  │  ├─ runs
│  │     │  │  │  │  ├─ output_item_list_params.py
│  │     │  │  │  │  ├─ output_item_list_response.py
│  │     │  │  │  │  ├─ output_item_retrieve_response.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ run_cancel_response.py
│  │     │  │  │  ├─ run_create_params.py
│  │     │  │  │  ├─ run_create_response.py
│  │     │  │  │  ├─ run_delete_response.py
│  │     │  │  │  ├─ run_list_params.py
│  │     │  │  │  ├─ run_list_response.py
│  │     │  │  │  ├─ run_retrieve_response.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ eval_create_params.py
│  │     │  │  ├─ eval_create_response.py
│  │     │  │  ├─ eval_custom_data_source_config.py
│  │     │  │  ├─ eval_delete_response.py
│  │     │  │  ├─ eval_list_params.py
│  │     │  │  ├─ eval_list_response.py
│  │     │  │  ├─ eval_retrieve_response.py
│  │     │  │  ├─ eval_stored_completions_data_source_config.py
│  │     │  │  ├─ eval_update_params.py
│  │     │  │  ├─ eval_update_response.py
│  │     │  │  ├─ file_chunking_strategy.py
│  │     │  │  ├─ file_chunking_strategy_param.py
│  │     │  │  ├─ file_content.py
│  │     │  │  ├─ file_create_params.py
│  │     │  │  ├─ file_deleted.py
│  │     │  │  ├─ file_list_params.py
│  │     │  │  ├─ file_object.py
│  │     │  │  ├─ file_purpose.py
│  │     │  │  ├─ fine_tuning
│  │     │  │  │  ├─ alpha
│  │     │  │  │  │  ├─ grader_run_params.py
│  │     │  │  │  │  ├─ grader_run_response.py
│  │     │  │  │  │  ├─ grader_validate_params.py
│  │     │  │  │  │  ├─ grader_validate_response.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ checkpoints
│  │     │  │  │  │  ├─ permission_create_params.py
│  │     │  │  │  │  ├─ permission_create_response.py
│  │     │  │  │  │  ├─ permission_delete_response.py
│  │     │  │  │  │  ├─ permission_list_params.py
│  │     │  │  │  │  ├─ permission_list_response.py
│  │     │  │  │  │  ├─ permission_retrieve_params.py
│  │     │  │  │  │  ├─ permission_retrieve_response.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ dpo_hyperparameters.py
│  │     │  │  │  ├─ dpo_hyperparameters_param.py
│  │     │  │  │  ├─ dpo_method.py
│  │     │  │  │  ├─ dpo_method_param.py
│  │     │  │  │  ├─ fine_tuning_job.py
│  │     │  │  │  ├─ fine_tuning_job_event.py
│  │     │  │  │  ├─ fine_tuning_job_integration.py
│  │     │  │  │  ├─ fine_tuning_job_wandb_integration.py
│  │     │  │  │  ├─ fine_tuning_job_wandb_integration_object.py
│  │     │  │  │  ├─ jobs
│  │     │  │  │  │  ├─ checkpoint_list_params.py
│  │     │  │  │  │  ├─ fine_tuning_job_checkpoint.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ job_create_params.py
│  │     │  │  │  ├─ job_list_events_params.py
│  │     │  │  │  ├─ job_list_params.py
│  │     │  │  │  ├─ reinforcement_hyperparameters.py
│  │     │  │  │  ├─ reinforcement_hyperparameters_param.py
│  │     │  │  │  ├─ reinforcement_method.py
│  │     │  │  │  ├─ reinforcement_method_param.py
│  │     │  │  │  ├─ supervised_hyperparameters.py
│  │     │  │  │  ├─ supervised_hyperparameters_param.py
│  │     │  │  │  ├─ supervised_method.py
│  │     │  │  │  ├─ supervised_method_param.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ graders
│  │     │  │  │  ├─ grader_inputs.py
│  │     │  │  │  ├─ grader_inputs_param.py
│  │     │  │  │  ├─ label_model_grader.py
│  │     │  │  │  ├─ label_model_grader_param.py
│  │     │  │  │  ├─ multi_grader.py
│  │     │  │  │  ├─ multi_grader_param.py
│  │     │  │  │  ├─ python_grader.py
│  │     │  │  │  ├─ python_grader_param.py
│  │     │  │  │  ├─ score_model_grader.py
│  │     │  │  │  ├─ score_model_grader_param.py
│  │     │  │  │  ├─ string_check_grader.py
│  │     │  │  │  ├─ string_check_grader_param.py
│  │     │  │  │  ├─ text_similarity_grader.py
│  │     │  │  │  ├─ text_similarity_grader_param.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ image.py
│  │     │  │  ├─ images_response.py
│  │     │  │  ├─ image_create_variation_params.py
│  │     │  │  ├─ image_edit_completed_event.py
│  │     │  │  ├─ image_edit_params.py
│  │     │  │  ├─ image_edit_partial_image_event.py
│  │     │  │  ├─ image_edit_stream_event.py
│  │     │  │  ├─ image_generate_params.py
│  │     │  │  ├─ image_gen_completed_event.py
│  │     │  │  ├─ image_gen_partial_image_event.py
│  │     │  │  ├─ image_gen_stream_event.py
│  │     │  │  ├─ image_input_reference_param.py
│  │     │  │  ├─ image_model.py
│  │     │  │  ├─ live
│  │     │  │  │  ├─ audio_format.py
│  │     │  │  │  ├─ audio_format_param.py
│  │     │  │  │  ├─ built_in_voice.py
│  │     │  │  │  ├─ client_config.py
│  │     │  │  │  ├─ client_config_param.py
│  │     │  │  │  ├─ client_delegation.py
│  │     │  │  │  ├─ client_delegation_param.py
│  │     │  │  │  ├─ client_event.py
│  │     │  │  │  ├─ client_event_param.py
│  │     │  │  │  ├─ commentary_appended_event.py
│  │     │  │  │  ├─ commentary_append_event.py
│  │     │  │  │  ├─ commentary_append_event_param.py
│  │     │  │  │  ├─ connect_client_event.py
│  │     │  │  │  ├─ connect_client_event_param.py
│  │     │  │  │  ├─ connect_server_event.py
│  │     │  │  │  ├─ custom_voice.py
│  │     │  │  │  ├─ custom_voice_param.py
│  │     │  │  │  ├─ data_channel_config.py
│  │     │  │  │  ├─ data_channel_config_param.py
│  │     │  │  │  ├─ delegation_created_event.py
│  │     │  │  │  ├─ error.py
│  │     │  │  │  ├─ error_event.py
│  │     │  │  │  ├─ fork_client_event.py
│  │     │  │  │  ├─ fork_client_event_param.py
│  │     │  │  │  ├─ fork_server_event.py
│  │     │  │  │  ├─ fork_session_config.py
│  │     │  │  │  ├─ fork_session_config_param.py
│  │     │  │  │  ├─ fork_session_start_event.py
│  │     │  │  │  ├─ fork_session_start_event_param.py
│  │     │  │  │  ├─ function_tool.py
│  │     │  │  │  ├─ function_tool_param.py
│  │     │  │  │  ├─ info_event.py
│  │     │  │  │  ├─ initial_item.py
│  │     │  │  │  ├─ initial_item_param.py
│  │     │  │  │  ├─ input_audio_append_event.py
│  │     │  │  │  ├─ input_audio_append_event_param.py
│  │     │  │  │  ├─ input_audio_muted_event.py
│  │     │  │  │  ├─ input_audio_mute_event.py
│  │     │  │  │  ├─ input_audio_mute_event_param.py
│  │     │  │  │  ├─ input_audio_unmuted_event.py
│  │     │  │  │  ├─ input_audio_unmute_event.py
│  │     │  │  │  ├─ input_audio_unmute_event_param.py
│  │     │  │  │  ├─ input_transcript_delta_event.py
│  │     │  │  │  ├─ instructions_appended_event.py
│  │     │  │  │  ├─ instructions_append_event.py
│  │     │  │  │  ├─ instructions_append_event_param.py
│  │     │  │  │  ├─ live_create_params.py
│  │     │  │  │  ├─ live_create_response.py
│  │     │  │  │  ├─ media_session_config_param.py
│  │     │  │  │  ├─ media_session_fork_config_param.py
│  │     │  │  │  ├─ output_audio_delta_event.py
│  │     │  │  │  ├─ output_transcript_delta_event.py
│  │     │  │  │  ├─ responses_delegation_config.py
│  │     │  │  │  ├─ responses_delegation_config_param.py
│  │     │  │  │  ├─ responses_delegation_update_config.py
│  │     │  │  │  ├─ responses_delegation_update_config_param.py
│  │     │  │  │  ├─ response_create_event.py
│  │     │  │  │  ├─ response_create_event_param.py
│  │     │  │  │  ├─ response_event.py
│  │     │  │  │  ├─ response_item_create_event.py
│  │     │  │  │  ├─ response_item_create_event_param.py
│  │     │  │  │  ├─ server_event.py
│  │     │  │  │  ├─ server_event_selector.py
│  │     │  │  │  ├─ server_event_selector_param.py
│  │     │  │  │  ├─ session_accept_params.py
│  │     │  │  │  ├─ session_closed_event.py
│  │     │  │  │  ├─ session_close_event.py
│  │     │  │  │  ├─ session_close_event_param.py
│  │     │  │  │  ├─ session_config.py
│  │     │  │  │  ├─ session_config_param.py
│  │     │  │  │  ├─ session_fork_params.py
│  │     │  │  │  ├─ session_fork_response.py
│  │     │  │  │  ├─ session_refer_params.py
│  │     │  │  │  ├─ session_reject_params.py
│  │     │  │  │  ├─ session_resource.py
│  │     │  │  │  ├─ session_started_event.py
│  │     │  │  │  ├─ session_start_event.py
│  │     │  │  │  ├─ session_start_event_param.py
│  │     │  │  │  ├─ session_updated_event.py
│  │     │  │  │  ├─ session_update_config.py
│  │     │  │  │  ├─ session_update_config_param.py
│  │     │  │  │  ├─ session_update_event.py
│  │     │  │  │  ├─ session_update_event_param.py
│  │     │  │  │  ├─ session_usage.py
│  │     │  │  │  ├─ session_usage_updated_event.py
│  │     │  │  │  ├─ sideband_connect_params.py
│  │     │  │  │  ├─ thinking_appended_event.py
│  │     │  │  │  ├─ thinking_append_event.py
│  │     │  │  │  ├─ thinking_append_event_param.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ model.py
│  │     │  │  ├─ model_deleted.py
│  │     │  │  ├─ moderation.py
│  │     │  │  ├─ moderation_create_params.py
│  │     │  │  ├─ moderation_create_response.py
│  │     │  │  ├─ moderation_image_url_input_param.py
│  │     │  │  ├─ moderation_model.py
│  │     │  │  ├─ moderation_multi_modal_input_param.py
│  │     │  │  ├─ moderation_text_input_param.py
│  │     │  │  ├─ other_file_chunking_strategy_object.py
│  │     │  │  ├─ realtime
│  │     │  │  │  ├─ audio_transcription.py
│  │     │  │  │  ├─ audio_transcription_param.py
│  │     │  │  │  ├─ call_accept_params.py
│  │     │  │  │  ├─ call_create_params.py
│  │     │  │  │  ├─ call_refer_params.py
│  │     │  │  │  ├─ call_reject_params.py
│  │     │  │  │  ├─ client_secret_create_params.py
│  │     │  │  │  ├─ client_secret_create_response.py
│  │     │  │  │  ├─ conversation_created_event.py
│  │     │  │  │  ├─ conversation_item.py
│  │     │  │  │  ├─ conversation_item_added.py
│  │     │  │  │  ├─ conversation_item_created_event.py
│  │     │  │  │  ├─ conversation_item_create_event.py
│  │     │  │  │  ├─ conversation_item_create_event_param.py
│  │     │  │  │  ├─ conversation_item_deleted_event.py
│  │     │  │  │  ├─ conversation_item_delete_event.py
│  │     │  │  │  ├─ conversation_item_delete_event_param.py
│  │     │  │  │  ├─ conversation_item_done.py
│  │     │  │  │  ├─ conversation_item_input_audio_transcription_completed_event.py
│  │     │  │  │  ├─ conversation_item_input_audio_transcription_delta_event.py
│  │     │  │  │  ├─ conversation_item_input_audio_transcription_failed_event.py
│  │     │  │  │  ├─ conversation_item_input_audio_transcription_segment.py
│  │     │  │  │  ├─ conversation_item_param.py
│  │     │  │  │  ├─ conversation_item_retrieve_event.py
│  │     │  │  │  ├─ conversation_item_retrieve_event_param.py
│  │     │  │  │  ├─ conversation_item_truncated_event.py
│  │     │  │  │  ├─ conversation_item_truncate_event.py
│  │     │  │  │  ├─ conversation_item_truncate_event_param.py
│  │     │  │  │  ├─ input_audio_buffer_append_event.py
│  │     │  │  │  ├─ input_audio_buffer_append_event_param.py
│  │     │  │  │  ├─ input_audio_buffer_cleared_event.py
│  │     │  │  │  ├─ input_audio_buffer_clear_event.py
│  │     │  │  │  ├─ input_audio_buffer_clear_event_param.py
│  │     │  │  │  ├─ input_audio_buffer_committed_event.py
│  │     │  │  │  ├─ input_audio_buffer_commit_event.py
│  │     │  │  │  ├─ input_audio_buffer_commit_event_param.py
│  │     │  │  │  ├─ input_audio_buffer_dtmf_event_received_event.py
│  │     │  │  │  ├─ input_audio_buffer_speech_started_event.py
│  │     │  │  │  ├─ input_audio_buffer_speech_stopped_event.py
│  │     │  │  │  ├─ input_audio_buffer_timeout_triggered.py
│  │     │  │  │  ├─ log_prob_properties.py
│  │     │  │  │  ├─ mcp_list_tools_completed.py
│  │     │  │  │  ├─ mcp_list_tools_failed.py
│  │     │  │  │  ├─ mcp_list_tools_in_progress.py
│  │     │  │  │  ├─ noise_reduction_type.py
│  │     │  │  │  ├─ output_audio_buffer_clear_event.py
│  │     │  │  │  ├─ output_audio_buffer_clear_event_param.py
│  │     │  │  │  ├─ rate_limits_updated_event.py
│  │     │  │  │  ├─ realtime_audio_config.py
│  │     │  │  │  ├─ realtime_audio_config_input.py
│  │     │  │  │  ├─ realtime_audio_config_input_param.py
│  │     │  │  │  ├─ realtime_audio_config_output.py
│  │     │  │  │  ├─ realtime_audio_config_output_param.py
│  │     │  │  │  ├─ realtime_audio_config_param.py
│  │     │  │  │  ├─ realtime_audio_formats.py
│  │     │  │  │  ├─ realtime_audio_formats_param.py
│  │     │  │  │  ├─ realtime_audio_input_turn_detection.py
│  │     │  │  │  ├─ realtime_audio_input_turn_detection_param.py
│  │     │  │  │  ├─ realtime_client_event.py
│  │     │  │  │  ├─ realtime_client_event_param.py
│  │     │  │  │  ├─ realtime_connect_params.py
│  │     │  │  │  ├─ realtime_conversation_item_assistant_message.py
│  │     │  │  │  ├─ realtime_conversation_item_assistant_message_param.py
│  │     │  │  │  ├─ realtime_conversation_item_function_call.py
│  │     │  │  │  ├─ realtime_conversation_item_function_call_output.py
│  │     │  │  │  ├─ realtime_conversation_item_function_call_output_param.py
│  │     │  │  │  ├─ realtime_conversation_item_function_call_param.py
│  │     │  │  │  ├─ realtime_conversation_item_system_message.py
│  │     │  │  │  ├─ realtime_conversation_item_system_message_param.py
│  │     │  │  │  ├─ realtime_conversation_item_user_message.py
│  │     │  │  │  ├─ realtime_conversation_item_user_message_param.py
│  │     │  │  │  ├─ realtime_error.py
│  │     │  │  │  ├─ realtime_error_event.py
│  │     │  │  │  ├─ realtime_function_tool.py
│  │     │  │  │  ├─ realtime_function_tool_param.py
│  │     │  │  │  ├─ realtime_mcphttp_error.py
│  │     │  │  │  ├─ realtime_mcphttp_error_param.py
│  │     │  │  │  ├─ realtime_mcp_approval_request.py
│  │     │  │  │  ├─ realtime_mcp_approval_request_param.py
│  │     │  │  │  ├─ realtime_mcp_approval_response.py
│  │     │  │  │  ├─ realtime_mcp_approval_response_param.py
│  │     │  │  │  ├─ realtime_mcp_list_tools.py
│  │     │  │  │  ├─ realtime_mcp_list_tools_param.py
│  │     │  │  │  ├─ realtime_mcp_protocol_error.py
│  │     │  │  │  ├─ realtime_mcp_protocol_error_param.py
│  │     │  │  │  ├─ realtime_mcp_tool_call.py
│  │     │  │  │  ├─ realtime_mcp_tool_call_param.py
│  │     │  │  │  ├─ realtime_mcp_tool_execution_error.py
│  │     │  │  │  ├─ realtime_mcp_tool_execution_error_param.py
│  │     │  │  │  ├─ realtime_reasoning.py
│  │     │  │  │  ├─ realtime_reasoning_effort.py
│  │     │  │  │  ├─ realtime_reasoning_param.py
│  │     │  │  │  ├─ realtime_response.py
│  │     │  │  │  ├─ realtime_response_create_audio_output.py
│  │     │  │  │  ├─ realtime_response_create_audio_output_param.py
│  │     │  │  │  ├─ realtime_response_create_mcp_tool.py
│  │     │  │  │  ├─ realtime_response_create_mcp_tool_param.py
│  │     │  │  │  ├─ realtime_response_create_params.py
│  │     │  │  │  ├─ realtime_response_create_params_param.py
│  │     │  │  │  ├─ realtime_response_status.py
│  │     │  │  │  ├─ realtime_response_usage.py
│  │     │  │  │  ├─ realtime_response_usage_input_token_details.py
│  │     │  │  │  ├─ realtime_response_usage_output_token_details.py
│  │     │  │  │  ├─ realtime_server_event.py
│  │     │  │  │  ├─ realtime_session_create_request.py
│  │     │  │  │  ├─ realtime_session_create_request_param.py
│  │     │  │  │  ├─ realtime_session_create_response.py
│  │     │  │  │  ├─ realtime_tools_config.py
│  │     │  │  │  ├─ realtime_tools_config_param.py
│  │     │  │  │  ├─ realtime_tools_config_union.py
│  │     │  │  │  ├─ realtime_tools_config_union_param.py
│  │     │  │  │  ├─ realtime_tool_choice_config.py
│  │     │  │  │  ├─ realtime_tool_choice_config_param.py
│  │     │  │  │  ├─ realtime_tracing_config.py
│  │     │  │  │  ├─ realtime_tracing_config_param.py
│  │     │  │  │  ├─ realtime_transcription_session_audio.py
│  │     │  │  │  ├─ realtime_transcription_session_audio_input.py
│  │     │  │  │  ├─ realtime_transcription_session_audio_input_param.py
│  │     │  │  │  ├─ realtime_transcription_session_audio_input_turn_detection.py
│  │     │  │  │  ├─ realtime_transcription_session_audio_input_turn_detection_param.py
│  │     │  │  │  ├─ realtime_transcription_session_audio_param.py
│  │     │  │  │  ├─ realtime_transcription_session_create_request.py
│  │     │  │  │  ├─ realtime_transcription_session_create_request_param.py
│  │     │  │  │  ├─ realtime_transcription_session_create_response.py
│  │     │  │  │  ├─ realtime_transcription_session_turn_detection.py
│  │     │  │  │  ├─ realtime_translation_client_secret_create_response.py
│  │     │  │  │  ├─ realtime_translation_session.py
│  │     │  │  │  ├─ realtime_translation_session_create_request_param.py
│  │     │  │  │  ├─ realtime_truncation.py
│  │     │  │  │  ├─ realtime_truncation_param.py
│  │     │  │  │  ├─ realtime_truncation_retention_ratio.py
│  │     │  │  │  ├─ realtime_truncation_retention_ratio_param.py
│  │     │  │  │  ├─ response_audio_delta_event.py
│  │     │  │  │  ├─ response_audio_done_event.py
│  │     │  │  │  ├─ response_audio_transcript_delta_event.py
│  │     │  │  │  ├─ response_audio_transcript_done_event.py
│  │     │  │  │  ├─ response_cancel_event.py
│  │     │  │  │  ├─ response_cancel_event_param.py
│  │     │  │  │  ├─ response_content_part_added_event.py
│  │     │  │  │  ├─ response_content_part_done_event.py
│  │     │  │  │  ├─ response_created_event.py
│  │     │  │  │  ├─ response_create_event.py
│  │     │  │  │  ├─ response_create_event_param.py
│  │     │  │  │  ├─ response_done_event.py
│  │     │  │  │  ├─ response_function_call_arguments_delta_event.py
│  │     │  │  │  ├─ response_function_call_arguments_done_event.py
│  │     │  │  │  ├─ response_mcp_call_arguments_delta.py
│  │     │  │  │  ├─ response_mcp_call_arguments_done.py
│  │     │  │  │  ├─ response_mcp_call_completed.py
│  │     │  │  │  ├─ response_mcp_call_failed.py
│  │     │  │  │  ├─ response_mcp_call_in_progress.py
│  │     │  │  │  ├─ response_output_item_added_event.py
│  │     │  │  │  ├─ response_output_item_done_event.py
│  │     │  │  │  ├─ response_text_delta_event.py
│  │     │  │  │  ├─ response_text_done_event.py
│  │     │  │  │  ├─ session_created_event.py
│  │     │  │  │  ├─ session_updated_event.py
│  │     │  │  │  ├─ session_update_event.py
│  │     │  │  │  ├─ session_update_event_param.py
│  │     │  │  │  ├─ translations
│  │     │  │  │  │  ├─ client_secret_create_params.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ responses
│  │     │  │  │  ├─ apply_patch_tool.py
│  │     │  │  │  ├─ apply_patch_tool_param.py
│  │     │  │  │  ├─ compacted_response.py
│  │     │  │  │  ├─ computer_action.py
│  │     │  │  │  ├─ computer_action_list.py
│  │     │  │  │  ├─ computer_action_list_param.py
│  │     │  │  │  ├─ computer_action_param.py
│  │     │  │  │  ├─ computer_tool.py
│  │     │  │  │  ├─ computer_tool_param.py
│  │     │  │  │  ├─ computer_use_preview_tool.py
│  │     │  │  │  ├─ computer_use_preview_tool_param.py
│  │     │  │  │  ├─ container_auto.py
│  │     │  │  │  ├─ container_auto_param.py
│  │     │  │  │  ├─ container_network_policy_allowlist.py
│  │     │  │  │  ├─ container_network_policy_allowlist_param.py
│  │     │  │  │  ├─ container_network_policy_disabled.py
│  │     │  │  │  ├─ container_network_policy_disabled_param.py
│  │     │  │  │  ├─ container_network_policy_domain_secret.py
│  │     │  │  │  ├─ container_network_policy_domain_secret_param.py
│  │     │  │  │  ├─ container_reference.py
│  │     │  │  │  ├─ container_reference_param.py
│  │     │  │  │  ├─ custom_tool.py
│  │     │  │  │  ├─ custom_tool_param.py
│  │     │  │  │  ├─ easy_input_message.py
│  │     │  │  │  ├─ easy_input_message_param.py
│  │     │  │  │  ├─ file_search_tool.py
│  │     │  │  │  ├─ file_search_tool_param.py
│  │     │  │  │  ├─ function_shell_tool.py
│  │     │  │  │  ├─ function_shell_tool_param.py
│  │     │  │  │  ├─ function_tool.py
│  │     │  │  │  ├─ function_tool_param.py
│  │     │  │  │  ├─ image_detail.py
│  │     │  │  │  ├─ inline_skill.py
│  │     │  │  │  ├─ inline_skill_param.py
│  │     │  │  │  ├─ inline_skill_source.py
│  │     │  │  │  ├─ inline_skill_source_param.py
│  │     │  │  │  ├─ input_item_list_params.py
│  │     │  │  │  ├─ input_token_count_params.py
│  │     │  │  │  ├─ input_token_count_response.py
│  │     │  │  │  ├─ local_environment.py
│  │     │  │  │  ├─ local_environment_param.py
│  │     │  │  │  ├─ local_skill.py
│  │     │  │  │  ├─ local_skill_param.py
│  │     │  │  │  ├─ mcp_tool_call_error.py
│  │     │  │  │  ├─ mcp_tool_call_error_param.py
│  │     │  │  │  ├─ namespace_tool.py
│  │     │  │  │  ├─ namespace_tool_param.py
│  │     │  │  │  ├─ parsed_response.py
│  │     │  │  │  ├─ response.py
│  │     │  │  │  ├─ responses_client_event.py
│  │     │  │  │  ├─ responses_client_event_param.py
│  │     │  │  │  ├─ responses_server_event.py
│  │     │  │  │  ├─ response_apply_patch_tool_call.py
│  │     │  │  │  ├─ response_apply_patch_tool_call_output.py
│  │     │  │  │  ├─ response_audio_delta_event.py
│  │     │  │  │  ├─ response_audio_done_event.py
│  │     │  │  │  ├─ response_audio_transcript_delta_event.py
│  │     │  │  │  ├─ response_audio_transcript_done_event.py
│  │     │  │  │  ├─ response_code_interpreter_call_code_delta_event.py
│  │     │  │  │  ├─ response_code_interpreter_call_code_done_event.py
│  │     │  │  │  ├─ response_code_interpreter_call_completed_event.py
│  │     │  │  │  ├─ response_code_interpreter_call_interpreting_event.py
│  │     │  │  │  ├─ response_code_interpreter_call_in_progress_event.py
│  │     │  │  │  ├─ response_code_interpreter_tool_call.py
│  │     │  │  │  ├─ response_code_interpreter_tool_call_param.py
│  │     │  │  │  ├─ response_compaction_compacting_event.py
│  │     │  │  │  ├─ response_compaction_item.py
│  │     │  │  │  ├─ response_compaction_item_param.py
│  │     │  │  │  ├─ response_compaction_item_param_param.py
│  │     │  │  │  ├─ response_compact_params.py
│  │     │  │  │  ├─ response_completed_event.py
│  │     │  │  │  ├─ response_computer_tool_call.py
│  │     │  │  │  ├─ response_computer_tool_call_output_item.py
│  │     │  │  │  ├─ response_computer_tool_call_output_screenshot.py
│  │     │  │  │  ├─ response_computer_tool_call_output_screenshot_param.py
│  │     │  │  │  ├─ response_computer_tool_call_param.py
│  │     │  │  │  ├─ response_configuration_update_item.py
│  │     │  │  │  ├─ response_configuration_update_item_param.py
│  │     │  │  │  ├─ response_configuration_update_item_param_param.py
│  │     │  │  │  ├─ response_container_reference.py
│  │     │  │  │  ├─ response_content_part_added_event.py
│  │     │  │  │  ├─ response_content_part_done_event.py
│  │     │  │  │  ├─ response_conversation_param.py
│  │     │  │  │  ├─ response_conversation_param_param.py
│  │     │  │  │  ├─ response_created_event.py
│  │     │  │  │  ├─ response_create_params.py
│  │     │  │  │  ├─ response_custom_tool_call.py
│  │     │  │  │  ├─ response_custom_tool_call_input_delta_event.py
│  │     │  │  │  ├─ response_custom_tool_call_input_done_event.py
│  │     │  │  │  ├─ response_custom_tool_call_item.py
│  │     │  │  │  ├─ response_custom_tool_call_output.py
│  │     │  │  │  ├─ response_custom_tool_call_output_item.py
│  │     │  │  │  ├─ response_custom_tool_call_output_param.py
│  │     │  │  │  ├─ response_custom_tool_call_param.py
│  │     │  │  │  ├─ response_error.py
│  │     │  │  │  ├─ response_error_event.py
│  │     │  │  │  ├─ response_failed_event.py
│  │     │  │  │  ├─ response_file_search_call_completed_event.py
│  │     │  │  │  ├─ response_file_search_call_in_progress_event.py
│  │     │  │  │  ├─ response_file_search_call_searching_event.py
│  │     │  │  │  ├─ response_file_search_tool_call.py
│  │     │  │  │  ├─ response_file_search_tool_call_param.py
│  │     │  │  │  ├─ response_format_text_config.py
│  │     │  │  │  ├─ response_format_text_config_param.py
│  │     │  │  │  ├─ response_format_text_json_schema_config.py
│  │     │  │  │  ├─ response_format_text_json_schema_config_param.py
│  │     │  │  │  ├─ response_function_call_arguments_delta_event.py
│  │     │  │  │  ├─ response_function_call_arguments_done_event.py
│  │     │  │  │  ├─ response_function_call_output_item.py
│  │     │  │  │  ├─ response_function_call_output_item_list.py
│  │     │  │  │  ├─ response_function_call_output_item_list_param.py
│  │     │  │  │  ├─ response_function_call_output_item_param.py
│  │     │  │  │  ├─ response_function_shell_call_output_content.py
│  │     │  │  │  ├─ response_function_shell_call_output_content_param.py
│  │     │  │  │  ├─ response_function_shell_tool_call.py
│  │     │  │  │  ├─ response_function_shell_tool_call_output.py
│  │     │  │  │  ├─ response_function_tool_call.py
│  │     │  │  │  ├─ response_function_tool_call_item.py
│  │     │  │  │  ├─ response_function_tool_call_output_item.py
│  │     │  │  │  ├─ response_function_tool_call_param.py
│  │     │  │  │  ├─ response_function_web_search.py
│  │     │  │  │  ├─ response_function_web_search_param.py
│  │     │  │  │  ├─ response_image_gen_call_completed_event.py
│  │     │  │  │  ├─ response_image_gen_call_generating_event.py
│  │     │  │  │  ├─ response_image_gen_call_in_progress_event.py
│  │     │  │  │  ├─ response_image_gen_call_partial_image_event.py
│  │     │  │  │  ├─ response_includable.py
│  │     │  │  │  ├─ response_incomplete_event.py
│  │     │  │  │  ├─ response_input.py
│  │     │  │  │  ├─ response_input_audio.py
│  │     │  │  │  ├─ response_input_audio_param.py
│  │     │  │  │  ├─ response_input_content.py
│  │     │  │  │  ├─ response_input_content_param.py
│  │     │  │  │  ├─ response_input_file.py
│  │     │  │  │  ├─ response_input_file_content.py
│  │     │  │  │  ├─ response_input_file_content_param.py
│  │     │  │  │  ├─ response_input_file_param.py
│  │     │  │  │  ├─ response_input_image.py
│  │     │  │  │  ├─ response_input_image_content.py
│  │     │  │  │  ├─ response_input_image_content_param.py
│  │     │  │  │  ├─ response_input_image_param.py
│  │     │  │  │  ├─ response_input_item.py
│  │     │  │  │  ├─ response_input_item_param.py
│  │     │  │  │  ├─ response_input_message_content_list.py
│  │     │  │  │  ├─ response_input_message_content_list_param.py
│  │     │  │  │  ├─ response_input_message_item.py
│  │     │  │  │  ├─ response_input_param.py
│  │     │  │  │  ├─ response_input_text.py
│  │     │  │  │  ├─ response_input_text_content.py
│  │     │  │  │  ├─ response_input_text_content_param.py
│  │     │  │  │  ├─ response_input_text_param.py
│  │     │  │  │  ├─ response_in_progress_event.py
│  │     │  │  │  ├─ response_item.py
│  │     │  │  │  ├─ response_item_list.py
│  │     │  │  │  ├─ response_local_environment.py
│  │     │  │  │  ├─ response_mcp_call_arguments_delta_event.py
│  │     │  │  │  ├─ response_mcp_call_arguments_done_event.py
│  │     │  │  │  ├─ response_mcp_call_completed_event.py
│  │     │  │  │  ├─ response_mcp_call_failed_event.py
│  │     │  │  │  ├─ response_mcp_call_in_progress_event.py
│  │     │  │  │  ├─ response_mcp_list_tools_completed_event.py
│  │     │  │  │  ├─ response_mcp_list_tools_failed_event.py
│  │     │  │  │  ├─ response_mcp_list_tools_in_progress_event.py
│  │     │  │  │  ├─ response_output_item.py
│  │     │  │  │  ├─ response_output_item_added_event.py
│  │     │  │  │  ├─ response_output_item_done_event.py
│  │     │  │  │  ├─ response_output_message.py
│  │     │  │  │  ├─ response_output_message_param.py
│  │     │  │  │  ├─ response_output_refusal.py
│  │     │  │  │  ├─ response_output_refusal_param.py
│  │     │  │  │  ├─ response_output_text.py
│  │     │  │  │  ├─ response_output_text_annotation_added_event.py
│  │     │  │  │  ├─ response_output_text_param.py
│  │     │  │  │  ├─ response_prompt.py
│  │     │  │  │  ├─ response_prompt_param.py
│  │     │  │  │  ├─ response_queued_event.py
│  │     │  │  │  ├─ response_reasoning_item.py
│  │     │  │  │  ├─ response_reasoning_item_param.py
│  │     │  │  │  ├─ response_reasoning_summary_part_added_event.py
│  │     │  │  │  ├─ response_reasoning_summary_part_done_event.py
│  │     │  │  │  ├─ response_reasoning_summary_text_delta_event.py
│  │     │  │  │  ├─ response_reasoning_summary_text_done_event.py
│  │     │  │  │  ├─ response_reasoning_text_delta_event.py
│  │     │  │  │  ├─ response_reasoning_text_done_event.py
│  │     │  │  │  ├─ response_refusal_delta_event.py
│  │     │  │  │  ├─ response_refusal_done_event.py
│  │     │  │  │  ├─ response_retrieve_params.py
│  │     │  │  │  ├─ response_shell_call_command_added_event.py
│  │     │  │  │  ├─ response_shell_call_command_delta_event.py
│  │     │  │  │  ├─ response_shell_call_command_done_event.py
│  │     │  │  │  ├─ response_shell_call_output_content_delta_event.py
│  │     │  │  │  ├─ response_shell_call_output_content_done_event.py
│  │     │  │  │  ├─ response_status.py
│  │     │  │  │  ├─ response_steer_accepted_event.py
│  │     │  │  │  ├─ response_steer_error_code.py
│  │     │  │  │  ├─ response_steer_event.py
│  │     │  │  │  ├─ response_steer_event_param.py
│  │     │  │  │  ├─ response_steer_failed_event.py
│  │     │  │  │  ├─ response_steer_input.py
│  │     │  │  │  ├─ response_steer_input_content.py
│  │     │  │  │  ├─ response_steer_input_content_param.py
│  │     │  │  │  ├─ response_steer_input_param.py
│  │     │  │  │  ├─ response_steer_pending_event.py
│  │     │  │  │  ├─ response_steer_pending_reason.py
│  │     │  │  │  ├─ response_steer_required_input.py
│  │     │  │  │  ├─ response_stream_event.py
│  │     │  │  │  ├─ response_text_config.py
│  │     │  │  │  ├─ response_text_config_param.py
│  │     │  │  │  ├─ response_text_delta_event.py
│  │     │  │  │  ├─ response_text_done_event.py
│  │     │  │  │  ├─ response_tool_search_call.py
│  │     │  │  │  ├─ response_tool_search_output_item.py
│  │     │  │  │  ├─ response_tool_search_output_item_param.py
│  │     │  │  │  ├─ response_tool_search_output_item_param_param.py
│  │     │  │  │  ├─ response_usage.py
│  │     │  │  │  ├─ response_web_search_call_completed_event.py
│  │     │  │  │  ├─ response_web_search_call_in_progress_event.py
│  │     │  │  │  ├─ response_web_search_call_searching_event.py
│  │     │  │  │  ├─ service_tier.py
│  │     │  │  │  ├─ skill_reference.py
│  │     │  │  │  ├─ skill_reference_param.py
│  │     │  │  │  ├─ tool.py
│  │     │  │  │  ├─ tool_choice_allowed.py
│  │     │  │  │  ├─ tool_choice_allowed_param.py
│  │     │  │  │  ├─ tool_choice_apply_patch.py
│  │     │  │  │  ├─ tool_choice_apply_patch_param.py
│  │     │  │  │  ├─ tool_choice_custom.py
│  │     │  │  │  ├─ tool_choice_custom_param.py
│  │     │  │  │  ├─ tool_choice_function.py
│  │     │  │  │  ├─ tool_choice_function_param.py
│  │     │  │  │  ├─ tool_choice_mcp.py
│  │     │  │  │  ├─ tool_choice_mcp_param.py
│  │     │  │  │  ├─ tool_choice_options.py
│  │     │  │  │  ├─ tool_choice_shell.py
│  │     │  │  │  ├─ tool_choice_shell_param.py
│  │     │  │  │  ├─ tool_choice_types.py
│  │     │  │  │  ├─ tool_choice_types_param.py
│  │     │  │  │  ├─ tool_param.py
│  │     │  │  │  ├─ tool_search_tool.py
│  │     │  │  │  ├─ tool_search_tool_param.py
│  │     │  │  │  ├─ web_search_preview_tool.py
│  │     │  │  │  ├─ web_search_preview_tool_param.py
│  │     │  │  │  ├─ web_search_tool.py
│  │     │  │  │  ├─ web_search_tool_param.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ safety
│  │     │  │  │  ├─ safety_alert.py
│  │     │  │  │  ├─ safety_case.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ shared
│  │     │  │  │  ├─ all_models.py
│  │     │  │  │  ├─ chat_model.py
│  │     │  │  │  ├─ comparison_filter.py
│  │     │  │  │  ├─ compound_filter.py
│  │     │  │  │  ├─ custom_tool_input_format.py
│  │     │  │  │  ├─ error_object.py
│  │     │  │  │  ├─ function_definition.py
│  │     │  │  │  ├─ function_parameters.py
│  │     │  │  │  ├─ metadata.py
│  │     │  │  │  ├─ oauth_error_code.py
│  │     │  │  │  ├─ reasoning.py
│  │     │  │  │  ├─ reasoning_effort.py
│  │     │  │  │  ├─ responses_model.py
│  │     │  │  │  ├─ response_format_json_object.py
│  │     │  │  │  ├─ response_format_json_schema.py
│  │     │  │  │  ├─ response_format_text.py
│  │     │  │  │  ├─ response_format_text_grammar.py
│  │     │  │  │  ├─ response_format_text_python.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ shared_params
│  │     │  │  │  ├─ chat_model.py
│  │     │  │  │  ├─ comparison_filter.py
│  │     │  │  │  ├─ compound_filter.py
│  │     │  │  │  ├─ custom_tool_input_format.py
│  │     │  │  │  ├─ function_definition.py
│  │     │  │  │  ├─ function_parameters.py
│  │     │  │  │  ├─ metadata.py
│  │     │  │  │  ├─ oauth_error_code.py
│  │     │  │  │  ├─ reasoning.py
│  │     │  │  │  ├─ reasoning_effort.py
│  │     │  │  │  ├─ responses_model.py
│  │     │  │  │  ├─ response_format_json_object.py
│  │     │  │  │  ├─ response_format_json_schema.py
│  │     │  │  │  ├─ response_format_text.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ skill.py
│  │     │  │  ├─ skills
│  │     │  │  │  ├─ deleted_skill_version.py
│  │     │  │  │  ├─ skill_version.py
│  │     │  │  │  ├─ skill_version_list.py
│  │     │  │  │  ├─ versions
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ version_create_params.py
│  │     │  │  │  ├─ version_list_params.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ skill_create_params.py
│  │     │  │  ├─ skill_list.py
│  │     │  │  ├─ skill_list_params.py
│  │     │  │  ├─ skill_update_params.py
│  │     │  │  ├─ static_file_chunking_strategy.py
│  │     │  │  ├─ static_file_chunking_strategy_object.py
│  │     │  │  ├─ static_file_chunking_strategy_object_param.py
│  │     │  │  ├─ static_file_chunking_strategy_param.py
│  │     │  │  ├─ upload.py
│  │     │  │  ├─ uploads
│  │     │  │  │  ├─ part_create_params.py
│  │     │  │  │  ├─ upload_part.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ upload_complete_params.py
│  │     │  │  ├─ upload_create_params.py
│  │     │  │  ├─ vector_store.py
│  │     │  │  ├─ vector_stores
│  │     │  │  │  ├─ file_batch_create_params.py
│  │     │  │  │  ├─ file_batch_list_files_params.py
│  │     │  │  │  ├─ file_content_response.py
│  │     │  │  │  ├─ file_create_params.py
│  │     │  │  │  ├─ file_list_params.py
│  │     │  │  │  ├─ file_update_params.py
│  │     │  │  │  ├─ vector_store_file.py
│  │     │  │  │  ├─ vector_store_file_batch.py
│  │     │  │  │  ├─ vector_store_file_deleted.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ vector_store_create_params.py
│  │     │  │  ├─ vector_store_deleted.py
│  │     │  │  ├─ vector_store_list_params.py
│  │     │  │  ├─ vector_store_search_params.py
│  │     │  │  ├─ vector_store_search_response.py
│  │     │  │  ├─ vector_store_update_params.py
│  │     │  │  ├─ video.py
│  │     │  │  ├─ video_create_character_params.py
│  │     │  │  ├─ video_create_character_response.py
│  │     │  │  ├─ video_create_error.py
│  │     │  │  ├─ video_create_params.py
│  │     │  │  ├─ video_delete_response.py
│  │     │  │  ├─ video_download_content_params.py
│  │     │  │  ├─ video_edit_params.py
│  │     │  │  ├─ video_extend_params.py
│  │     │  │  ├─ video_get_character_response.py
│  │     │  │  ├─ video_list_params.py
│  │     │  │  ├─ video_model.py
│  │     │  │  ├─ video_model_param.py
│  │     │  │  ├─ video_remix_params.py
│  │     │  │  ├─ video_seconds.py
│  │     │  │  ├─ video_size.py
│  │     │  │  ├─ webhooks
│  │     │  │  │  ├─ agent_session_action_required_webhook_event.py
│  │     │  │  │  ├─ agent_session_created_webhook_event.py
│  │     │  │  │  ├─ agent_session_failed_webhook_event.py
│  │     │  │  │  ├─ agent_session_idle_webhook_event.py
│  │     │  │  │  ├─ agent_session_in_progress_webhook_event.py
│  │     │  │  │  ├─ batch_cancelled_webhook_event.py
│  │     │  │  │  ├─ batch_completed_webhook_event.py
│  │     │  │  │  ├─ batch_expired_webhook_event.py
│  │     │  │  │  ├─ batch_failed_webhook_event.py
│  │     │  │  │  ├─ deleted_webhook_endpoint.py
│  │     │  │  │  ├─ eval_run_canceled_webhook_event.py
│  │     │  │  │  ├─ eval_run_failed_webhook_event.py
│  │     │  │  │  ├─ eval_run_succeeded_webhook_event.py
│  │     │  │  │  ├─ fine_tuning_job_cancelled_webhook_event.py
│  │     │  │  │  ├─ fine_tuning_job_failed_webhook_event.py
│  │     │  │  │  ├─ fine_tuning_job_succeeded_webhook_event.py
│  │     │  │  │  ├─ live_call_incoming_webhook_event.py
│  │     │  │  │  ├─ live_transport_incoming_webhook_event.py
│  │     │  │  │  ├─ realtime_call_incoming_webhook_event.py
│  │     │  │  │  ├─ response_cancelled_webhook_event.py
│  │     │  │  │  ├─ response_completed_webhook_event.py
│  │     │  │  │  ├─ response_failed_webhook_event.py
│  │     │  │  │  ├─ response_incomplete_webhook_event.py
│  │     │  │  │  ├─ safety_alert_created_webhook_event.py
│  │     │  │  │  ├─ safety_deactivation_issued_webhook_event.py
│  │     │  │  │  ├─ safety_identifier_blocked_webhook_event.py
│  │     │  │  │  ├─ safety_org_alert_created_webhook_event.py
│  │     │  │  │  ├─ safety_warning_issued_webhook_event.py
│  │     │  │  │  ├─ unwrap_webhook_event.py
│  │     │  │  │  ├─ webhook_create_params.py
│  │     │  │  │  ├─ webhook_endpoint.py
│  │     │  │  │  ├─ webhook_endpoint_list.py
│  │     │  │  │  ├─ webhook_endpoint_test_result.py
│  │     │  │  │  ├─ webhook_endpoint_with_secret.py
│  │     │  │  │  ├─ webhook_event_type_list.py
│  │     │  │  │  ├─ webhook_list_params.py
│  │     │  │  │  ├─ webhook_rotate_secret_params.py
│  │     │  │  │  ├─ webhook_test_params.py
│  │     │  │  │  ├─ webhook_update_params.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ websocket_connection_options.py
│  │     │  │  ├─ websocket_reconnection.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ version.py
│  │     │  ├─ _base_client.py
│  │     │  ├─ _client.py
│  │     │  ├─ _compat.py
│  │     │  ├─ _constants.py
│  │     │  ├─ _data_residency.py
│  │     │  ├─ _event_handler.py
│  │     │  ├─ _exceptions.py
│  │     │  ├─ _extras
│  │     │  │  ├─ numpy_proxy.py
│  │     │  │  ├─ pandas_proxy.py
│  │     │  │  ├─ sounddevice_proxy.py
│  │     │  │  ├─ _common.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _files.py
│  │     │  ├─ _httpx2.py
│  │     │  ├─ _legacy_response.py
│  │     │  ├─ _models.py
│  │     │  ├─ _module_client.py
│  │     │  ├─ _multipart.py
│  │     │  ├─ _provider.py
│  │     │  ├─ _qs.py
│  │     │  ├─ _resource.py
│  │     │  ├─ _response.py
│  │     │  ├─ _send_queue.py
│  │     │  ├─ _streaming.py
│  │     │  ├─ _types.py
│  │     │  ├─ _utils
│  │     │  │  ├─ _compat.py
│  │     │  │  ├─ _datetime_parse.py
│  │     │  │  ├─ _json.py
│  │     │  │  ├─ _logs.py
│  │     │  │  ├─ _path.py
│  │     │  │  ├─ _proxy.py
│  │     │  │  ├─ _reflection.py
│  │     │  │  ├─ _resources_proxy.py
│  │     │  │  ├─ _streams.py
│  │     │  │  ├─ _sync.py
│  │     │  │  ├─ _transform.py
│  │     │  │  ├─ _typing.py
│  │     │  │  ├─ _utils.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _vendor
│  │     │  │  ├─ httpx_aiohttp
│  │     │  │  │  ├─ client.py
│  │     │  │  │  ├─ FORK.md
│  │     │  │  │  ├─ LICENSE
│  │     │  │  │  ├─ README.md
│  │     │  │  │  ├─ transport.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _version.py
│  │     │  └─ __init__.py
│  │     ├─ openai-3.24.0.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ REQUESTED
│  │     │  └─ WHEEL
│  │     ├─ opentelemetry
│  │     │  ├─ attributes
│  │     │  │  ├─ py.typed
│  │     │  │  └─ __init__.py
│  │     │  ├─ baggage
│  │     │  │  ├─ propagation
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ py.typed
│  │     │  │  └─ __init__.py
│  │     │  ├─ context
│  │     │  │  ├─ context.py
│  │     │  │  ├─ contextvars_context.py
│  │     │  │  ├─ py.typed
│  │     │  │  └─ __init__.py
│  │     │  ├─ environment_variables
│  │     │  │  ├─ py.typed
│  │     │  │  └─ __init__.py
│  │     │  ├─ metrics
│  │     │  │  ├─ py.typed
│  │     │  │  ├─ _internal
│  │     │  │  │  ├─ instrument.py
│  │     │  │  │  ├─ observation.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ propagate
│  │     │  │  ├─ py.typed
│  │     │  │  └─ __init__.py
│  │     │  ├─ propagators
│  │     │  │  ├─ composite.py
│  │     │  │  ├─ py.typed
│  │     │  │  ├─ textmap.py
│  │     │  │  └─ _envcarrier.py
│  │     │  ├─ py.typed
│  │     │  ├─ trace
│  │     │  │  ├─ propagation
│  │     │  │  │  ├─ tracecontext.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ py.typed
│  │     │  │  ├─ span.py
│  │     │  │  ├─ status.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ util
│  │     │  │  ├─ py.typed
│  │     │  │  ├─ re.py
│  │     │  │  ├─ types.py
│  │     │  │  ├─ _decorator.py
│  │     │  │  ├─ _importlib_metadata.py
│  │     │  │  ├─ _once.py
│  │     │  │  └─ _providers.py
│  │     │  ├─ version
│  │     │  │  ├─ py.typed
│  │     │  │  └─ __init__.py
│  │     │  └─ _logs
│  │     │     ├─ py.typed
│  │     │     ├─ severity
│  │     │     │  └─ __init__.py
│  │     │     ├─ _internal
│  │     │     │  └─ __init__.py
│  │     │     └─ __init__.py
│  │     ├─ opentelemetry_api-1.45.0.dist-info
│  │     │  ├─ entry_points.txt
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  └─ WHEEL
│  │     ├─ oracledb
│  │     │  ├─ aq.py
│  │     │  ├─ arrow_array.py
│  │     │  ├─ arrow_impl.cp314-win_amd64.pyd
│  │     │  ├─ base.py
│  │     │  ├─ base_impl.cp314-win_amd64.pyd
│  │     │  ├─ builtin_hooks.py
│  │     │  ├─ connection.py
│  │     │  ├─ connect_params.py
│  │     │  ├─ constants.py
│  │     │  ├─ constructors.py
│  │     │  ├─ cursor.py
│  │     │  ├─ dataframe.py
│  │     │  ├─ dbobject.py
│  │     │  ├─ defaults.py
│  │     │  ├─ driver_mode.py
│  │     │  ├─ dsn.py
│  │     │  ├─ end_user_security_context.py
│  │     │  ├─ enums.py
│  │     │  ├─ errors.py
│  │     │  ├─ exceptions.py
│  │     │  ├─ fetch_info.py
│  │     │  ├─ future.py
│  │     │  ├─ lob.py
│  │     │  ├─ pipeline.py
│  │     │  ├─ plugins
│  │     │  │  ├─ aws_config_provider.py
│  │     │  │  ├─ azure_config_provider.py
│  │     │  │  ├─ azure_tokens.py
│  │     │  │  ├─ end_user_sec_provider.py
│  │     │  │  ├─ gcp_config_provider.py
│  │     │  │  ├─ oci_config_provider.py
│  │     │  │  └─ oci_tokens.py
│  │     │  ├─ pool.py
│  │     │  ├─ pool_params.py
│  │     │  ├─ py.typed
│  │     │  ├─ secret_values.py
│  │     │  ├─ soda.py
│  │     │  ├─ sparse_vector.py
│  │     │  ├─ subscr.py
│  │     │  ├─ thick_impl.cp314-win_amd64.pyd
│  │     │  ├─ thin_impl.cp314-win_amd64.pyd
│  │     │  ├─ utils.py
│  │     │  ├─ var.py
│  │     │  ├─ version.py
│  │     │  └─ __init__.py
│  │     ├─ oracledb-26.0.1.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  ├─ LICENSE.txt
│  │     │  │  ├─ NOTICE.txt
│  │     │  │  └─ THIRD_PARTY_LICENSES.txt
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ REQUESTED
│  │     │  ├─ top_level.txt
│  │     │  └─ WHEEL
│  │     ├─ pandas
│  │     │  ├─ api
│  │     │  │  ├─ executors
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ extensions
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ indexers
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ interchange
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ internals.py
│  │     │  │  ├─ types
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ typing
│  │     │  │  │  ├─ aliases.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ arrays
│  │     │  │  └─ __init__.py
│  │     │  ├─ compat
│  │     │  │  ├─ numpy
│  │     │  │  │  ├─ function.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ pickle_compat.py
│  │     │  │  ├─ pyarrow.py
│  │     │  │  ├─ _constants.py
│  │     │  │  ├─ _optional.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ conftest.py
│  │     │  ├─ core
│  │     │  │  ├─ accessor.py
│  │     │  │  ├─ algorithms.py
│  │     │  │  ├─ api.py
│  │     │  │  ├─ apply.py
│  │     │  │  ├─ arraylike.py
│  │     │  │  ├─ arrays
│  │     │  │  │  ├─ arrow
│  │     │  │  │  │  ├─ accessors.py
│  │     │  │  │  │  ├─ array.py
│  │     │  │  │  │  ├─ extension_types.py
│  │     │  │  │  │  ├─ _arrow_utils.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ base.py
│  │     │  │  │  ├─ boolean.py
│  │     │  │  │  ├─ categorical.py
│  │     │  │  │  ├─ datetimelike.py
│  │     │  │  │  ├─ datetimes.py
│  │     │  │  │  ├─ floating.py
│  │     │  │  │  ├─ integer.py
│  │     │  │  │  ├─ interval.py
│  │     │  │  │  ├─ masked.py
│  │     │  │  │  ├─ numeric.py
│  │     │  │  │  ├─ numpy_.py
│  │     │  │  │  ├─ period.py
│  │     │  │  │  ├─ sparse
│  │     │  │  │  │  ├─ accessor.py
│  │     │  │  │  │  ├─ array.py
│  │     │  │  │  │  ├─ scipy_sparse.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ string_.py
│  │     │  │  │  ├─ string_arrow.py
│  │     │  │  │  ├─ timedeltas.py
│  │     │  │  │  ├─ _arrow_string_mixins.py
│  │     │  │  │  ├─ _mixins.py
│  │     │  │  │  ├─ _ranges.py
│  │     │  │  │  ├─ _utils.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ array_algos
│  │     │  │  │  ├─ datetimelike_accumulations.py
│  │     │  │  │  ├─ masked_accumulations.py
│  │     │  │  │  ├─ masked_reductions.py
│  │     │  │  │  ├─ putmask.py
│  │     │  │  │  ├─ quantile.py
│  │     │  │  │  ├─ replace.py
│  │     │  │  │  ├─ take.py
│  │     │  │  │  ├─ transforms.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ base.py
│  │     │  │  ├─ col.py
│  │     │  │  ├─ common.py
│  │     │  │  ├─ computation
│  │     │  │  │  ├─ align.py
│  │     │  │  │  ├─ api.py
│  │     │  │  │  ├─ check.py
│  │     │  │  │  ├─ common.py
│  │     │  │  │  ├─ engines.py
│  │     │  │  │  ├─ eval.py
│  │     │  │  │  ├─ expr.py
│  │     │  │  │  ├─ expressions.py
│  │     │  │  │  ├─ ops.py
│  │     │  │  │  ├─ parsing.py
│  │     │  │  │  ├─ pytables.py
│  │     │  │  │  ├─ scope.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ config_init.py
│  │     │  │  ├─ construction.py
│  │     │  │  ├─ dtypes
│  │     │  │  │  ├─ api.py
│  │     │  │  │  ├─ astype.py
│  │     │  │  │  ├─ base.py
│  │     │  │  │  ├─ cast.py
│  │     │  │  │  ├─ common.py
│  │     │  │  │  ├─ concat.py
│  │     │  │  │  ├─ dtypes.py
│  │     │  │  │  ├─ generic.py
│  │     │  │  │  ├─ inference.py
│  │     │  │  │  ├─ missing.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ flags.py
│  │     │  │  ├─ frame.py
│  │     │  │  ├─ generic.py
│  │     │  │  ├─ groupby
│  │     │  │  │  ├─ base.py
│  │     │  │  │  ├─ categorical.py
│  │     │  │  │  ├─ generic.py
│  │     │  │  │  ├─ groupby.py
│  │     │  │  │  ├─ grouper.py
│  │     │  │  │  ├─ indexing.py
│  │     │  │  │  ├─ numba_.py
│  │     │  │  │  ├─ ops.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ indexers
│  │     │  │  │  ├─ objects.py
│  │     │  │  │  ├─ utils.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ indexes
│  │     │  │  │  ├─ accessors.py
│  │     │  │  │  ├─ api.py
│  │     │  │  │  ├─ base.py
│  │     │  │  │  ├─ category.py
│  │     │  │  │  ├─ datetimelike.py
│  │     │  │  │  ├─ datetimes.py
│  │     │  │  │  ├─ extension.py
│  │     │  │  │  ├─ frozen.py
│  │     │  │  │  ├─ interval.py
│  │     │  │  │  ├─ multi.py
│  │     │  │  │  ├─ period.py
│  │     │  │  │  ├─ range.py
│  │     │  │  │  ├─ timedeltas.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ indexing.py
│  │     │  │  ├─ interchange
│  │     │  │  │  ├─ buffer.py
│  │     │  │  │  ├─ column.py
│  │     │  │  │  ├─ dataframe.py
│  │     │  │  │  ├─ dataframe_protocol.py
│  │     │  │  │  ├─ from_dataframe.py
│  │     │  │  │  ├─ utils.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ internals
│  │     │  │  │  ├─ api.py
│  │     │  │  │  ├─ blocks.py
│  │     │  │  │  ├─ concat.py
│  │     │  │  │  ├─ construction.py
│  │     │  │  │  ├─ managers.py
│  │     │  │  │  ├─ ops.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ methods
│  │     │  │  │  ├─ describe.py
│  │     │  │  │  ├─ selectn.py
│  │     │  │  │  ├─ to_dict.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ missing.py
│  │     │  │  ├─ nanops.py
│  │     │  │  ├─ ops
│  │     │  │  │  ├─ array_ops.py
│  │     │  │  │  ├─ common.py
│  │     │  │  │  ├─ dispatch.py
│  │     │  │  │  ├─ docstrings.py
│  │     │  │  │  ├─ invalid.py
│  │     │  │  │  ├─ mask_ops.py
│  │     │  │  │  ├─ missing.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ resample.py
│  │     │  │  ├─ reshape
│  │     │  │  │  ├─ api.py
│  │     │  │  │  ├─ concat.py
│  │     │  │  │  ├─ encoding.py
│  │     │  │  │  ├─ melt.py
│  │     │  │  │  ├─ merge.py
│  │     │  │  │  ├─ pivot.py
│  │     │  │  │  ├─ reshape.py
│  │     │  │  │  ├─ tile.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ roperator.py
│  │     │  │  ├─ sample.py
│  │     │  │  ├─ series.py
│  │     │  │  ├─ shared_docs.py
│  │     │  │  ├─ sorting.py
│  │     │  │  ├─ sparse
│  │     │  │  │  ├─ api.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ strings
│  │     │  │  │  ├─ accessor.py
│  │     │  │  │  ├─ object_array.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ tools
│  │     │  │  │  ├─ datetimes.py
│  │     │  │  │  ├─ numeric.py
│  │     │  │  │  ├─ timedeltas.py
│  │     │  │  │  ├─ times.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ util
│  │     │  │  │  ├─ hashing.py
│  │     │  │  │  ├─ numba_.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ window
│  │     │  │  │  ├─ common.py
│  │     │  │  │  ├─ doc.py
│  │     │  │  │  ├─ ewm.py
│  │     │  │  │  ├─ expanding.py
│  │     │  │  │  ├─ numba_.py
│  │     │  │  │  ├─ online.py
│  │     │  │  │  ├─ rolling.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ _numba
│  │     │  │  │  ├─ executor.py
│  │     │  │  │  ├─ extensions.py
│  │     │  │  │  ├─ kernels
│  │     │  │  │  │  ├─ mean_.py
│  │     │  │  │  │  ├─ min_max_.py
│  │     │  │  │  │  ├─ shared.py
│  │     │  │  │  │  ├─ sum_.py
│  │     │  │  │  │  ├─ var_.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ errors
│  │     │  │  ├─ cow.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ io
│  │     │  │  ├─ api.py
│  │     │  │  ├─ clipboard
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ clipboards.py
│  │     │  │  ├─ common.py
│  │     │  │  ├─ excel
│  │     │  │  │  ├─ _base.py
│  │     │  │  │  ├─ _calamine.py
│  │     │  │  │  ├─ _odfreader.py
│  │     │  │  │  ├─ _odswriter.py
│  │     │  │  │  ├─ _openpyxl.py
│  │     │  │  │  ├─ _pyxlsb.py
│  │     │  │  │  ├─ _util.py
│  │     │  │  │  ├─ _xlrd.py
│  │     │  │  │  ├─ _xlsxwriter.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ feather_format.py
│  │     │  │  ├─ formats
│  │     │  │  │  ├─ console.py
│  │     │  │  │  ├─ css.py
│  │     │  │  │  ├─ csvs.py
│  │     │  │  │  ├─ excel.py
│  │     │  │  │  ├─ format.py
│  │     │  │  │  ├─ html.py
│  │     │  │  │  ├─ info.py
│  │     │  │  │  ├─ printing.py
│  │     │  │  │  ├─ string.py
│  │     │  │  │  ├─ style.py
│  │     │  │  │  ├─ style_render.py
│  │     │  │  │  ├─ templates
│  │     │  │  │  │  ├─ html.tpl
│  │     │  │  │  │  ├─ html_style.tpl
│  │     │  │  │  │  ├─ html_table.tpl
│  │     │  │  │  │  ├─ latex.tpl
│  │     │  │  │  │  ├─ latex_longtable.tpl
│  │     │  │  │  │  ├─ latex_table.tpl
│  │     │  │  │  │  ├─ string.tpl
│  │     │  │  │  │  └─ typst.tpl
│  │     │  │  │  ├─ xml.py
│  │     │  │  │  ├─ _color_data.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ html.py
│  │     │  │  ├─ iceberg.py
│  │     │  │  ├─ json
│  │     │  │  │  ├─ _json.py
│  │     │  │  │  ├─ _normalize.py
│  │     │  │  │  ├─ _table_schema.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ orc.py
│  │     │  │  ├─ parquet.py
│  │     │  │  ├─ parsers
│  │     │  │  │  ├─ arrow_parser_wrapper.py
│  │     │  │  │  ├─ base_parser.py
│  │     │  │  │  ├─ c_parser_wrapper.py
│  │     │  │  │  ├─ python_parser.py
│  │     │  │  │  ├─ readers.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ pickle.py
│  │     │  │  ├─ pytables.py
│  │     │  │  ├─ sas
│  │     │  │  │  ├─ sas7bdat.py
│  │     │  │  │  ├─ sasreader.py
│  │     │  │  │  ├─ sas_constants.py
│  │     │  │  │  ├─ sas_xport.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ spss.py
│  │     │  │  ├─ sql.py
│  │     │  │  ├─ stata.py
│  │     │  │  ├─ xml.py
│  │     │  │  ├─ _util.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ plotting
│  │     │  │  ├─ _core.py
│  │     │  │  ├─ _matplotlib
│  │     │  │  │  ├─ boxplot.py
│  │     │  │  │  ├─ converter.py
│  │     │  │  │  ├─ core.py
│  │     │  │  │  ├─ groupby.py
│  │     │  │  │  ├─ hist.py
│  │     │  │  │  ├─ misc.py
│  │     │  │  │  ├─ style.py
│  │     │  │  │  ├─ timeseries.py
│  │     │  │  │  ├─ tools.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ _misc.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ pyproject.toml
│  │     │  ├─ testing.py
│  │     │  ├─ tests
│  │     │  │  ├─ api
│  │     │  │  │  ├─ test_api.py
│  │     │  │  │  ├─ test_types.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ apply
│  │     │  │  │  ├─ common.py
│  │     │  │  │  ├─ conftest.py
│  │     │  │  │  ├─ test_frame_apply.py
│  │     │  │  │  ├─ test_frame_apply_relabeling.py
│  │     │  │  │  ├─ test_frame_transform.py
│  │     │  │  │  ├─ test_invalid_arg.py
│  │     │  │  │  ├─ test_numba.py
│  │     │  │  │  ├─ test_series_apply.py
│  │     │  │  │  ├─ test_series_apply_relabeling.py
│  │     │  │  │  ├─ test_series_transform.py
│  │     │  │  │  ├─ test_str.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ arithmetic
│  │     │  │  │  ├─ common.py
│  │     │  │  │  ├─ conftest.py
│  │     │  │  │  ├─ test_array_ops.py
│  │     │  │  │  ├─ test_bool.py
│  │     │  │  │  ├─ test_categorical.py
│  │     │  │  │  ├─ test_datetime64.py
│  │     │  │  │  ├─ test_interval.py
│  │     │  │  │  ├─ test_numeric.py
│  │     │  │  │  ├─ test_object.py
│  │     │  │  │  ├─ test_period.py
│  │     │  │  │  ├─ test_string.py
│  │     │  │  │  ├─ test_timedelta64.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ arrays
│  │     │  │  │  ├─ boolean
│  │     │  │  │  │  ├─ test_arithmetic.py
│  │     │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  ├─ test_comparison.py
│  │     │  │  │  │  ├─ test_construction.py
│  │     │  │  │  │  ├─ test_function.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_logical.py
│  │     │  │  │  │  ├─ test_ops.py
│  │     │  │  │  │  ├─ test_reduction.py
│  │     │  │  │  │  ├─ test_repr.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ categorical
│  │     │  │  │  │  ├─ test_algos.py
│  │     │  │  │  │  ├─ test_analytics.py
│  │     │  │  │  │  ├─ test_api.py
│  │     │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  ├─ test_constructors.py
│  │     │  │  │  │  ├─ test_dtypes.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_map.py
│  │     │  │  │  │  ├─ test_missing.py
│  │     │  │  │  │  ├─ test_operators.py
│  │     │  │  │  │  ├─ test_replace.py
│  │     │  │  │  │  ├─ test_repr.py
│  │     │  │  │  │  ├─ test_sorting.py
│  │     │  │  │  │  ├─ test_subclass.py
│  │     │  │  │  │  ├─ test_take.py
│  │     │  │  │  │  ├─ test_warnings.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ datetimes
│  │     │  │  │  │  ├─ test_constructors.py
│  │     │  │  │  │  ├─ test_cumulative.py
│  │     │  │  │  │  ├─ test_reductions.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ floating
│  │     │  │  │  │  ├─ conftest.py
│  │     │  │  │  │  ├─ test_arithmetic.py
│  │     │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  ├─ test_comparison.py
│  │     │  │  │  │  ├─ test_concat.py
│  │     │  │  │  │  ├─ test_construction.py
│  │     │  │  │  │  ├─ test_contains.py
│  │     │  │  │  │  ├─ test_function.py
│  │     │  │  │  │  ├─ test_repr.py
│  │     │  │  │  │  ├─ test_to_numpy.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ integer
│  │     │  │  │  │  ├─ conftest.py
│  │     │  │  │  │  ├─ test_arithmetic.py
│  │     │  │  │  │  ├─ test_comparison.py
│  │     │  │  │  │  ├─ test_concat.py
│  │     │  │  │  │  ├─ test_construction.py
│  │     │  │  │  │  ├─ test_dtypes.py
│  │     │  │  │  │  ├─ test_function.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_reduction.py
│  │     │  │  │  │  ├─ test_repr.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ interval
│  │     │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  ├─ test_formats.py
│  │     │  │  │  │  ├─ test_interval.py
│  │     │  │  │  │  ├─ test_interval_pyarrow.py
│  │     │  │  │  │  ├─ test_overlaps.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ masked
│  │     │  │  │  │  ├─ test_arithmetic.py
│  │     │  │  │  │  ├─ test_arrow_compat.py
│  │     │  │  │  │  ├─ test_function.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ masked_shared.py
│  │     │  │  │  ├─ numpy_
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_numpy.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ period
│  │     │  │  │  │  ├─ test_arrow_compat.py
│  │     │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  ├─ test_constructors.py
│  │     │  │  │  │  ├─ test_reductions.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ sparse
│  │     │  │  │  │  ├─ test_accessor.py
│  │     │  │  │  │  ├─ test_arithmetics.py
│  │     │  │  │  │  ├─ test_array.py
│  │     │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  ├─ test_combine_concat.py
│  │     │  │  │  │  ├─ test_constructors.py
│  │     │  │  │  │  ├─ test_dtype.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_libsparse.py
│  │     │  │  │  │  ├─ test_reductions.py
│  │     │  │  │  │  ├─ test_unary.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ string_
│  │     │  │  │  │  ├─ test_concat.py
│  │     │  │  │  │  ├─ test_string.py
│  │     │  │  │  │  ├─ test_string_arrow.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ test_array.py
│  │     │  │  │  ├─ test_datetimelike.py
│  │     │  │  │  ├─ test_datetimes.py
│  │     │  │  │  ├─ test_ndarray_backed.py
│  │     │  │  │  ├─ test_period.py
│  │     │  │  │  ├─ test_timedeltas.py
│  │     │  │  │  ├─ timedeltas
│  │     │  │  │  │  ├─ test_constructors.py
│  │     │  │  │  │  ├─ test_cumulative.py
│  │     │  │  │  │  ├─ test_reductions.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ base
│  │     │  │  │  ├─ common.py
│  │     │  │  │  ├─ test_constructors.py
│  │     │  │  │  ├─ test_conversion.py
│  │     │  │  │  ├─ test_fillna.py
│  │     │  │  │  ├─ test_misc.py
│  │     │  │  │  ├─ test_transpose.py
│  │     │  │  │  ├─ test_unique.py
│  │     │  │  │  ├─ test_value_counts.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ computation
│  │     │  │  │  ├─ test_compat.py
│  │     │  │  │  ├─ test_eval.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ config
│  │     │  │  │  ├─ test_config.py
│  │     │  │  │  ├─ test_localization.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ construction
│  │     │  │  │  ├─ test_extract_array.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ copy_view
│  │     │  │  │  ├─ index
│  │     │  │  │  │  ├─ test_datetimeindex.py
│  │     │  │  │  │  ├─ test_index.py
│  │     │  │  │  │  ├─ test_intervalindex.py
│  │     │  │  │  │  ├─ test_periodindex.py
│  │     │  │  │  │  ├─ test_timedeltaindex.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ test_array.py
│  │     │  │  │  ├─ test_astype.py
│  │     │  │  │  ├─ test_chained_assignment_deprecation.py
│  │     │  │  │  ├─ test_clip.py
│  │     │  │  │  ├─ test_constructors.py
│  │     │  │  │  ├─ test_copy_deprecation.py
│  │     │  │  │  ├─ test_core_functionalities.py
│  │     │  │  │  ├─ test_functions.py
│  │     │  │  │  ├─ test_indexing.py
│  │     │  │  │  ├─ test_internals.py
│  │     │  │  │  ├─ test_interp_fillna.py
│  │     │  │  │  ├─ test_methods.py
│  │     │  │  │  ├─ test_replace.py
│  │     │  │  │  ├─ test_setitem.py
│  │     │  │  │  ├─ test_util.py
│  │     │  │  │  ├─ util.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ dtypes
│  │     │  │  │  ├─ cast
│  │     │  │  │  │  ├─ test_box_unbox.py
│  │     │  │  │  │  ├─ test_can_hold_element.py
│  │     │  │  │  │  ├─ test_construct_from_scalar.py
│  │     │  │  │  │  ├─ test_construct_ndarray.py
│  │     │  │  │  │  ├─ test_construct_object_arr.py
│  │     │  │  │  │  ├─ test_dict_compat.py
│  │     │  │  │  │  ├─ test_downcast.py
│  │     │  │  │  │  ├─ test_find_common_type.py
│  │     │  │  │  │  ├─ test_infer_datetimelike.py
│  │     │  │  │  │  ├─ test_infer_dtype.py
│  │     │  │  │  │  ├─ test_promote.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ test_common.py
│  │     │  │  │  ├─ test_concat.py
│  │     │  │  │  ├─ test_dtypes.py
│  │     │  │  │  ├─ test_generic.py
│  │     │  │  │  ├─ test_inference.py
│  │     │  │  │  ├─ test_missing.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ extension
│  │     │  │  │  ├─ array_with_attr
│  │     │  │  │  │  ├─ array.py
│  │     │  │  │  │  ├─ test_array_with_attr.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ base
│  │     │  │  │  │  ├─ accumulate.py
│  │     │  │  │  │  ├─ base.py
│  │     │  │  │  │  ├─ casting.py
│  │     │  │  │  │  ├─ constructors.py
│  │     │  │  │  │  ├─ dim2.py
│  │     │  │  │  │  ├─ dtype.py
│  │     │  │  │  │  ├─ getitem.py
│  │     │  │  │  │  ├─ groupby.py
│  │     │  │  │  │  ├─ index.py
│  │     │  │  │  │  ├─ interface.py
│  │     │  │  │  │  ├─ io.py
│  │     │  │  │  │  ├─ methods.py
│  │     │  │  │  │  ├─ missing.py
│  │     │  │  │  │  ├─ ops.py
│  │     │  │  │  │  ├─ printing.py
│  │     │  │  │  │  ├─ reduce.py
│  │     │  │  │  │  ├─ reshaping.py
│  │     │  │  │  │  ├─ setitem.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ conftest.py
│  │     │  │  │  ├─ date
│  │     │  │  │  │  ├─ array.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ decimal
│  │     │  │  │  │  ├─ array.py
│  │     │  │  │  │  ├─ test_decimal.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ json
│  │     │  │  │  │  ├─ array.py
│  │     │  │  │  │  ├─ test_json.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ list
│  │     │  │  │  │  ├─ array.py
│  │     │  │  │  │  ├─ test_list.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ test_arrow.py
│  │     │  │  │  ├─ test_categorical.py
│  │     │  │  │  ├─ test_common.py
│  │     │  │  │  ├─ test_datetime.py
│  │     │  │  │  ├─ test_extension.py
│  │     │  │  │  ├─ test_interval.py
│  │     │  │  │  ├─ test_masked.py
│  │     │  │  │  ├─ test_numpy.py
│  │     │  │  │  ├─ test_period.py
│  │     │  │  │  ├─ test_sparse.py
│  │     │  │  │  ├─ test_string.py
│  │     │  │  │  ├─ uuid
│  │     │  │  │  │  ├─ test_uuid.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ frame
│  │     │  │  │  ├─ common.py
│  │     │  │  │  ├─ conftest.py
│  │     │  │  │  ├─ constructors
│  │     │  │  │  │  ├─ test_from_dict.py
│  │     │  │  │  │  ├─ test_from_records.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ indexing
│  │     │  │  │  │  ├─ test_coercion.py
│  │     │  │  │  │  ├─ test_delitem.py
│  │     │  │  │  │  ├─ test_get.py
│  │     │  │  │  │  ├─ test_getitem.py
│  │     │  │  │  │  ├─ test_get_value.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_insert.py
│  │     │  │  │  │  ├─ test_mask.py
│  │     │  │  │  │  ├─ test_setitem.py
│  │     │  │  │  │  ├─ test_set_value.py
│  │     │  │  │  │  ├─ test_take.py
│  │     │  │  │  │  ├─ test_where.py
│  │     │  │  │  │  ├─ test_xs.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ methods
│  │     │  │  │  │  ├─ test_add_prefix_suffix.py
│  │     │  │  │  │  ├─ test_align.py
│  │     │  │  │  │  ├─ test_asfreq.py
│  │     │  │  │  │  ├─ test_asof.py
│  │     │  │  │  │  ├─ test_assign.py
│  │     │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  ├─ test_at_time.py
│  │     │  │  │  │  ├─ test_between_time.py
│  │     │  │  │  │  ├─ test_clip.py
│  │     │  │  │  │  ├─ test_combine.py
│  │     │  │  │  │  ├─ test_combine_first.py
│  │     │  │  │  │  ├─ test_compare.py
│  │     │  │  │  │  ├─ test_convert_dtypes.py
│  │     │  │  │  │  ├─ test_copy.py
│  │     │  │  │  │  ├─ test_count.py
│  │     │  │  │  │  ├─ test_cov_corr.py
│  │     │  │  │  │  ├─ test_describe.py
│  │     │  │  │  │  ├─ test_diff.py
│  │     │  │  │  │  ├─ test_dot.py
│  │     │  │  │  │  ├─ test_drop.py
│  │     │  │  │  │  ├─ test_droplevel.py
│  │     │  │  │  │  ├─ test_dropna.py
│  │     │  │  │  │  ├─ test_drop_duplicates.py
│  │     │  │  │  │  ├─ test_dtypes.py
│  │     │  │  │  │  ├─ test_duplicated.py
│  │     │  │  │  │  ├─ test_equals.py
│  │     │  │  │  │  ├─ test_explode.py
│  │     │  │  │  │  ├─ test_fillna.py
│  │     │  │  │  │  ├─ test_filter.py
│  │     │  │  │  │  ├─ test_first_valid_index.py
│  │     │  │  │  │  ├─ test_get_numeric_data.py
│  │     │  │  │  │  ├─ test_head_tail.py
│  │     │  │  │  │  ├─ test_infer_objects.py
│  │     │  │  │  │  ├─ test_info.py
│  │     │  │  │  │  ├─ test_interpolate.py
│  │     │  │  │  │  ├─ test_isetitem.py
│  │     │  │  │  │  ├─ test_isin.py
│  │     │  │  │  │  ├─ test_is_homogeneous_dtype.py
│  │     │  │  │  │  ├─ test_iterrows.py
│  │     │  │  │  │  ├─ test_join.py
│  │     │  │  │  │  ├─ test_map.py
│  │     │  │  │  │  ├─ test_matmul.py
│  │     │  │  │  │  ├─ test_nlargest.py
│  │     │  │  │  │  ├─ test_pct_change.py
│  │     │  │  │  │  ├─ test_pipe.py
│  │     │  │  │  │  ├─ test_pop.py
│  │     │  │  │  │  ├─ test_quantile.py
│  │     │  │  │  │  ├─ test_rank.py
│  │     │  │  │  │  ├─ test_reindex.py
│  │     │  │  │  │  ├─ test_reindex_like.py
│  │     │  │  │  │  ├─ test_rename.py
│  │     │  │  │  │  ├─ test_rename_axis.py
│  │     │  │  │  │  ├─ test_reorder_levels.py
│  │     │  │  │  │  ├─ test_replace.py
│  │     │  │  │  │  ├─ test_reset_index.py
│  │     │  │  │  │  ├─ test_round.py
│  │     │  │  │  │  ├─ test_sample.py
│  │     │  │  │  │  ├─ test_select_dtypes.py
│  │     │  │  │  │  ├─ test_set_axis.py
│  │     │  │  │  │  ├─ test_set_index.py
│  │     │  │  │  │  ├─ test_shift.py
│  │     │  │  │  │  ├─ test_size.py
│  │     │  │  │  │  ├─ test_sort_index.py
│  │     │  │  │  │  ├─ test_sort_values.py
│  │     │  │  │  │  ├─ test_swaplevel.py
│  │     │  │  │  │  ├─ test_to_csv.py
│  │     │  │  │  │  ├─ test_to_dict.py
│  │     │  │  │  │  ├─ test_to_dict_of_blocks.py
│  │     │  │  │  │  ├─ test_to_numpy.py
│  │     │  │  │  │  ├─ test_to_period.py
│  │     │  │  │  │  ├─ test_to_records.py
│  │     │  │  │  │  ├─ test_to_timestamp.py
│  │     │  │  │  │  ├─ test_transpose.py
│  │     │  │  │  │  ├─ test_truncate.py
│  │     │  │  │  │  ├─ test_tz_convert.py
│  │     │  │  │  │  ├─ test_tz_localize.py
│  │     │  │  │  │  ├─ test_update.py
│  │     │  │  │  │  ├─ test_values.py
│  │     │  │  │  │  ├─ test_value_counts.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ test_alter_axes.py
│  │     │  │  │  ├─ test_api.py
│  │     │  │  │  ├─ test_arithmetic.py
│  │     │  │  │  ├─ test_arrow_interface.py
│  │     │  │  │  ├─ test_block_internals.py
│  │     │  │  │  ├─ test_constructors.py
│  │     │  │  │  ├─ test_cumulative.py
│  │     │  │  │  ├─ test_iteration.py
│  │     │  │  │  ├─ test_logical_ops.py
│  │     │  │  │  ├─ test_nonunique_indexes.py
│  │     │  │  │  ├─ test_npfuncs.py
│  │     │  │  │  ├─ test_query_eval.py
│  │     │  │  │  ├─ test_reductions.py
│  │     │  │  │  ├─ test_repr.py
│  │     │  │  │  ├─ test_stack_unstack.py
│  │     │  │  │  ├─ test_subclass.py
│  │     │  │  │  ├─ test_ufunc.py
│  │     │  │  │  ├─ test_unary.py
│  │     │  │  │  ├─ test_validate.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ generic
│  │     │  │  │  ├─ test_duplicate_labels.py
│  │     │  │  │  ├─ test_finalize.py
│  │     │  │  │  ├─ test_frame.py
│  │     │  │  │  ├─ test_generic.py
│  │     │  │  │  ├─ test_label_or_level_utils.py
│  │     │  │  │  ├─ test_series.py
│  │     │  │  │  ├─ test_to_xarray.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ groupby
│  │     │  │  │  ├─ aggregate
│  │     │  │  │  │  ├─ test_aggregate.py
│  │     │  │  │  │  ├─ test_cython.py
│  │     │  │  │  │  ├─ test_numba.py
│  │     │  │  │  │  ├─ test_other.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ conftest.py
│  │     │  │  │  ├─ methods
│  │     │  │  │  │  ├─ test_describe.py
│  │     │  │  │  │  ├─ test_groupby_shift_diff.py
│  │     │  │  │  │  ├─ test_is_monotonic.py
│  │     │  │  │  │  ├─ test_kurt.py
│  │     │  │  │  │  ├─ test_nlargest_nsmallest.py
│  │     │  │  │  │  ├─ test_nth.py
│  │     │  │  │  │  ├─ test_quantile.py
│  │     │  │  │  │  ├─ test_rank.py
│  │     │  │  │  │  ├─ test_sample.py
│  │     │  │  │  │  ├─ test_size.py
│  │     │  │  │  │  ├─ test_skew.py
│  │     │  │  │  │  ├─ test_value_counts.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ test_all_methods.py
│  │     │  │  │  ├─ test_api.py
│  │     │  │  │  ├─ test_apply.py
│  │     │  │  │  ├─ test_bin_groupby.py
│  │     │  │  │  ├─ test_categorical.py
│  │     │  │  │  ├─ test_counting.py
│  │     │  │  │  ├─ test_cumulative.py
│  │     │  │  │  ├─ test_filters.py
│  │     │  │  │  ├─ test_groupby.py
│  │     │  │  │  ├─ test_groupby_dropna.py
│  │     │  │  │  ├─ test_groupby_subclass.py
│  │     │  │  │  ├─ test_grouping.py
│  │     │  │  │  ├─ test_indexing.py
│  │     │  │  │  ├─ test_index_as_string.py
│  │     │  │  │  ├─ test_libgroupby.py
│  │     │  │  │  ├─ test_missing.py
│  │     │  │  │  ├─ test_numba.py
│  │     │  │  │  ├─ test_numeric_only.py
│  │     │  │  │  ├─ test_pipe.py
│  │     │  │  │  ├─ test_raises.py
│  │     │  │  │  ├─ test_reductions.py
│  │     │  │  │  ├─ test_timegrouper.py
│  │     │  │  │  ├─ transform
│  │     │  │  │  │  ├─ test_numba.py
│  │     │  │  │  │  ├─ test_transform.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ indexes
│  │     │  │  │  ├─ base_class
│  │     │  │  │  │  ├─ test_constructors.py
│  │     │  │  │  │  ├─ test_formats.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_pickle.py
│  │     │  │  │  │  ├─ test_reshape.py
│  │     │  │  │  │  ├─ test_setops.py
│  │     │  │  │  │  ├─ test_where.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ categorical
│  │     │  │  │  │  ├─ test_append.py
│  │     │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  ├─ test_category.py
│  │     │  │  │  │  ├─ test_constructors.py
│  │     │  │  │  │  ├─ test_equals.py
│  │     │  │  │  │  ├─ test_fillna.py
│  │     │  │  │  │  ├─ test_formats.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_map.py
│  │     │  │  │  │  ├─ test_reindex.py
│  │     │  │  │  │  ├─ test_setops.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ conftest.py
│  │     │  │  │  ├─ datetimelike_
│  │     │  │  │  │  ├─ test_drop_duplicates.py
│  │     │  │  │  │  ├─ test_equals.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_is_monotonic.py
│  │     │  │  │  │  ├─ test_nat.py
│  │     │  │  │  │  ├─ test_sort_values.py
│  │     │  │  │  │  ├─ test_value_counts.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ datetimes
│  │     │  │  │  │  ├─ methods
│  │     │  │  │  │  │  ├─ test_asof.py
│  │     │  │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  │  ├─ test_delete.py
│  │     │  │  │  │  │  ├─ test_factorize.py
│  │     │  │  │  │  │  ├─ test_fillna.py
│  │     │  │  │  │  │  ├─ test_insert.py
│  │     │  │  │  │  │  ├─ test_isocalendar.py
│  │     │  │  │  │  │  ├─ test_map.py
│  │     │  │  │  │  │  ├─ test_normalize.py
│  │     │  │  │  │  │  ├─ test_repeat.py
│  │     │  │  │  │  │  ├─ test_resolution.py
│  │     │  │  │  │  │  ├─ test_round.py
│  │     │  │  │  │  │  ├─ test_shift.py
│  │     │  │  │  │  │  ├─ test_snap.py
│  │     │  │  │  │  │  ├─ test_to_frame.py
│  │     │  │  │  │  │  ├─ test_to_julian_date.py
│  │     │  │  │  │  │  ├─ test_to_period.py
│  │     │  │  │  │  │  ├─ test_to_pydatetime.py
│  │     │  │  │  │  │  ├─ test_to_series.py
│  │     │  │  │  │  │  ├─ test_tz_convert.py
│  │     │  │  │  │  │  ├─ test_tz_localize.py
│  │     │  │  │  │  │  ├─ test_unique.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ test_arithmetic.py
│  │     │  │  │  │  ├─ test_constructors.py
│  │     │  │  │  │  ├─ test_datetime.py
│  │     │  │  │  │  ├─ test_date_range.py
│  │     │  │  │  │  ├─ test_formats.py
│  │     │  │  │  │  ├─ test_freq_attr.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_iter.py
│  │     │  │  │  │  ├─ test_join.py
│  │     │  │  │  │  ├─ test_npfuncs.py
│  │     │  │  │  │  ├─ test_ops.py
│  │     │  │  │  │  ├─ test_partial_slicing.py
│  │     │  │  │  │  ├─ test_pickle.py
│  │     │  │  │  │  ├─ test_reindex.py
│  │     │  │  │  │  ├─ test_scalar_compat.py
│  │     │  │  │  │  ├─ test_setops.py
│  │     │  │  │  │  ├─ test_timezones.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ interval
│  │     │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  ├─ test_constructors.py
│  │     │  │  │  │  ├─ test_equals.py
│  │     │  │  │  │  ├─ test_formats.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_interval.py
│  │     │  │  │  │  ├─ test_interval_range.py
│  │     │  │  │  │  ├─ test_interval_tree.py
│  │     │  │  │  │  ├─ test_join.py
│  │     │  │  │  │  ├─ test_pickle.py
│  │     │  │  │  │  ├─ test_setops.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ multi
│  │     │  │  │  │  ├─ conftest.py
│  │     │  │  │  │  ├─ test_analytics.py
│  │     │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  ├─ test_compat.py
│  │     │  │  │  │  ├─ test_constructors.py
│  │     │  │  │  │  ├─ test_conversion.py
│  │     │  │  │  │  ├─ test_copy.py
│  │     │  │  │  │  ├─ test_drop.py
│  │     │  │  │  │  ├─ test_duplicates.py
│  │     │  │  │  │  ├─ test_equivalence.py
│  │     │  │  │  │  ├─ test_formats.py
│  │     │  │  │  │  ├─ test_get_level_values.py
│  │     │  │  │  │  ├─ test_get_set.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_integrity.py
│  │     │  │  │  │  ├─ test_isin.py
│  │     │  │  │  │  ├─ test_join.py
│  │     │  │  │  │  ├─ test_lexsort.py
│  │     │  │  │  │  ├─ test_missing.py
│  │     │  │  │  │  ├─ test_monotonic.py
│  │     │  │  │  │  ├─ test_names.py
│  │     │  │  │  │  ├─ test_partial_indexing.py
│  │     │  │  │  │  ├─ test_pickle.py
│  │     │  │  │  │  ├─ test_reindex.py
│  │     │  │  │  │  ├─ test_reshape.py
│  │     │  │  │  │  ├─ test_setops.py
│  │     │  │  │  │  ├─ test_sorting.py
│  │     │  │  │  │  ├─ test_take.py
│  │     │  │  │  │  ├─ test_util.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ numeric
│  │     │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_join.py
│  │     │  │  │  │  ├─ test_numeric.py
│  │     │  │  │  │  ├─ test_setops.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ object
│  │     │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ period
│  │     │  │  │  │  ├─ methods
│  │     │  │  │  │  │  ├─ test_asfreq.py
│  │     │  │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  │  ├─ test_factorize.py
│  │     │  │  │  │  │  ├─ test_fillna.py
│  │     │  │  │  │  │  ├─ test_insert.py
│  │     │  │  │  │  │  ├─ test_is_full.py
│  │     │  │  │  │  │  ├─ test_repeat.py
│  │     │  │  │  │  │  ├─ test_shift.py
│  │     │  │  │  │  │  ├─ test_to_timestamp.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ test_constructors.py
│  │     │  │  │  │  ├─ test_formats.py
│  │     │  │  │  │  ├─ test_freq_attr.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_join.py
│  │     │  │  │  │  ├─ test_monotonic.py
│  │     │  │  │  │  ├─ test_partial_slicing.py
│  │     │  │  │  │  ├─ test_period.py
│  │     │  │  │  │  ├─ test_period_range.py
│  │     │  │  │  │  ├─ test_pickle.py
│  │     │  │  │  │  ├─ test_resolution.py
│  │     │  │  │  │  ├─ test_scalar_compat.py
│  │     │  │  │  │  ├─ test_searchsorted.py
│  │     │  │  │  │  ├─ test_setops.py
│  │     │  │  │  │  ├─ test_tools.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ ranges
│  │     │  │  │  │  ├─ test_constructors.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_join.py
│  │     │  │  │  │  ├─ test_range.py
│  │     │  │  │  │  ├─ test_setops.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ string
│  │     │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ test_any_index.py
│  │     │  │  │  ├─ test_base.py
│  │     │  │  │  ├─ test_common.py
│  │     │  │  │  ├─ test_datetimelike.py
│  │     │  │  │  ├─ test_engines.py
│  │     │  │  │  ├─ test_frozen.py
│  │     │  │  │  ├─ test_indexing.py
│  │     │  │  │  ├─ test_index_new.py
│  │     │  │  │  ├─ test_numpy_compat.py
│  │     │  │  │  ├─ test_old_base.py
│  │     │  │  │  ├─ test_setops.py
│  │     │  │  │  ├─ test_subclass.py
│  │     │  │  │  ├─ timedeltas
│  │     │  │  │  │  ├─ methods
│  │     │  │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  │  ├─ test_factorize.py
│  │     │  │  │  │  │  ├─ test_fillna.py
│  │     │  │  │  │  │  ├─ test_insert.py
│  │     │  │  │  │  │  ├─ test_repeat.py
│  │     │  │  │  │  │  ├─ test_shift.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ test_arithmetic.py
│  │     │  │  │  │  ├─ test_constructors.py
│  │     │  │  │  │  ├─ test_delete.py
│  │     │  │  │  │  ├─ test_formats.py
│  │     │  │  │  │  ├─ test_freq_attr.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_join.py
│  │     │  │  │  │  ├─ test_ops.py
│  │     │  │  │  │  ├─ test_pickle.py
│  │     │  │  │  │  ├─ test_scalar_compat.py
│  │     │  │  │  │  ├─ test_searchsorted.py
│  │     │  │  │  │  ├─ test_setops.py
│  │     │  │  │  │  ├─ test_timedelta.py
│  │     │  │  │  │  ├─ test_timedelta_range.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ indexing
│  │     │  │  │  ├─ common.py
│  │     │  │  │  ├─ interval
│  │     │  │  │  │  ├─ test_interval.py
│  │     │  │  │  │  ├─ test_interval_new.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ multiindex
│  │     │  │  │  │  ├─ test_chaining_and_caching.py
│  │     │  │  │  │  ├─ test_datetime.py
│  │     │  │  │  │  ├─ test_getitem.py
│  │     │  │  │  │  ├─ test_iloc.py
│  │     │  │  │  │  ├─ test_indexing_slow.py
│  │     │  │  │  │  ├─ test_loc.py
│  │     │  │  │  │  ├─ test_multiindex.py
│  │     │  │  │  │  ├─ test_partial.py
│  │     │  │  │  │  ├─ test_setitem.py
│  │     │  │  │  │  ├─ test_slice.py
│  │     │  │  │  │  ├─ test_sorted.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ test_at.py
│  │     │  │  │  ├─ test_categorical.py
│  │     │  │  │  ├─ test_chaining_and_caching.py
│  │     │  │  │  ├─ test_check_indexer.py
│  │     │  │  │  ├─ test_coercion.py
│  │     │  │  │  ├─ test_datetime.py
│  │     │  │  │  ├─ test_floats.py
│  │     │  │  │  ├─ test_iat.py
│  │     │  │  │  ├─ test_iloc.py
│  │     │  │  │  ├─ test_indexers.py
│  │     │  │  │  ├─ test_indexing.py
│  │     │  │  │  ├─ test_loc.py
│  │     │  │  │  ├─ test_na_indexing.py
│  │     │  │  │  ├─ test_partial.py
│  │     │  │  │  ├─ test_scalar.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ interchange
│  │     │  │  │  ├─ test_impl.py
│  │     │  │  │  ├─ test_spec_conformance.py
│  │     │  │  │  ├─ test_utils.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ internals
│  │     │  │  │  ├─ test_api.py
│  │     │  │  │  ├─ test_internals.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ io
│  │     │  │  │  ├─ conftest.py
│  │     │  │  │  ├─ excel
│  │     │  │  │  │  ├─ test_odf.py
│  │     │  │  │  │  ├─ test_odswriter.py
│  │     │  │  │  │  ├─ test_openpyxl.py
│  │     │  │  │  │  ├─ test_readers.py
│  │     │  │  │  │  ├─ test_style.py
│  │     │  │  │  │  ├─ test_writers.py
│  │     │  │  │  │  ├─ test_xlrd.py
│  │     │  │  │  │  ├─ test_xlsxwriter.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ formats
│  │     │  │  │  │  ├─ style
│  │     │  │  │  │  │  ├─ test_bar.py
│  │     │  │  │  │  │  ├─ test_exceptions.py
│  │     │  │  │  │  │  ├─ test_format.py
│  │     │  │  │  │  │  ├─ test_highlight.py
│  │     │  │  │  │  │  ├─ test_html.py
│  │     │  │  │  │  │  ├─ test_matplotlib.py
│  │     │  │  │  │  │  ├─ test_non_unique.py
│  │     │  │  │  │  │  ├─ test_style.py
│  │     │  │  │  │  │  ├─ test_tooltip.py
│  │     │  │  │  │  │  ├─ test_to_latex.py
│  │     │  │  │  │  │  ├─ test_to_string.py
│  │     │  │  │  │  │  ├─ test_to_typst.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ test_console.py
│  │     │  │  │  │  ├─ test_css.py
│  │     │  │  │  │  ├─ test_eng_formatting.py
│  │     │  │  │  │  ├─ test_format.py
│  │     │  │  │  │  ├─ test_ipython_compat.py
│  │     │  │  │  │  ├─ test_printing.py
│  │     │  │  │  │  ├─ test_to_csv.py
│  │     │  │  │  │  ├─ test_to_excel.py
│  │     │  │  │  │  ├─ test_to_html.py
│  │     │  │  │  │  ├─ test_to_latex.py
│  │     │  │  │  │  ├─ test_to_markdown.py
│  │     │  │  │  │  ├─ test_to_string.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ generate_legacy_storage_files.py
│  │     │  │  │  ├─ json
│  │     │  │  │  │  ├─ conftest.py
│  │     │  │  │  │  ├─ test_compression.py
│  │     │  │  │  │  ├─ test_deprecated_kwargs.py
│  │     │  │  │  │  ├─ test_json_table_schema.py
│  │     │  │  │  │  ├─ test_json_table_schema_ext_dtype.py
│  │     │  │  │  │  ├─ test_normalize.py
│  │     │  │  │  │  ├─ test_pandas.py
│  │     │  │  │  │  ├─ test_readlines.py
│  │     │  │  │  │  ├─ test_ujson.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ parser
│  │     │  │  │  │  ├─ common
│  │     │  │  │  │  │  ├─ test_chunksize.py
│  │     │  │  │  │  │  ├─ test_common_basic.py
│  │     │  │  │  │  │  ├─ test_data_list.py
│  │     │  │  │  │  │  ├─ test_decimal.py
│  │     │  │  │  │  │  ├─ test_file_buffer_url.py
│  │     │  │  │  │  │  ├─ test_float.py
│  │     │  │  │  │  │  ├─ test_index.py
│  │     │  │  │  │  │  ├─ test_inf.py
│  │     │  │  │  │  │  ├─ test_ints.py
│  │     │  │  │  │  │  ├─ test_iterator.py
│  │     │  │  │  │  │  ├─ test_read_errors.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ conftest.py
│  │     │  │  │  │  ├─ dtypes
│  │     │  │  │  │  │  ├─ test_categorical.py
│  │     │  │  │  │  │  ├─ test_dtypes_basic.py
│  │     │  │  │  │  │  ├─ test_empty.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ test_comment.py
│  │     │  │  │  │  ├─ test_compression.py
│  │     │  │  │  │  ├─ test_concatenate_chunks.py
│  │     │  │  │  │  ├─ test_converters.py
│  │     │  │  │  │  ├─ test_c_parser_only.py
│  │     │  │  │  │  ├─ test_dialect.py
│  │     │  │  │  │  ├─ test_encoding.py
│  │     │  │  │  │  ├─ test_header.py
│  │     │  │  │  │  ├─ test_index_col.py
│  │     │  │  │  │  ├─ test_mangle_dupes.py
│  │     │  │  │  │  ├─ test_multi_thread.py
│  │     │  │  │  │  ├─ test_na_values.py
│  │     │  │  │  │  ├─ test_network.py
│  │     │  │  │  │  ├─ test_parse_dates.py
│  │     │  │  │  │  ├─ test_python_parser_only.py
│  │     │  │  │  │  ├─ test_quoting.py
│  │     │  │  │  │  ├─ test_read_fwf.py
│  │     │  │  │  │  ├─ test_skiprows.py
│  │     │  │  │  │  ├─ test_textreader.py
│  │     │  │  │  │  ├─ test_unsupported.py
│  │     │  │  │  │  ├─ test_upcast.py
│  │     │  │  │  │  ├─ usecols
│  │     │  │  │  │  │  ├─ test_parse_dates.py
│  │     │  │  │  │  │  ├─ test_strings.py
│  │     │  │  │  │  │  ├─ test_usecols_basic.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ pytables
│  │     │  │  │  │  ├─ common.py
│  │     │  │  │  │  ├─ conftest.py
│  │     │  │  │  │  ├─ test_append.py
│  │     │  │  │  │  ├─ test_categorical.py
│  │     │  │  │  │  ├─ test_compat.py
│  │     │  │  │  │  ├─ test_complex.py
│  │     │  │  │  │  ├─ test_errors.py
│  │     │  │  │  │  ├─ test_file_handling.py
│  │     │  │  │  │  ├─ test_keys.py
│  │     │  │  │  │  ├─ test_put.py
│  │     │  │  │  │  ├─ test_pytables_missing.py
│  │     │  │  │  │  ├─ test_read.py
│  │     │  │  │  │  ├─ test_retain_attributes.py
│  │     │  │  │  │  ├─ test_round_trip.py
│  │     │  │  │  │  ├─ test_select.py
│  │     │  │  │  │  ├─ test_store.py
│  │     │  │  │  │  ├─ test_subclass.py
│  │     │  │  │  │  ├─ test_timezones.py
│  │     │  │  │  │  ├─ test_time_series.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ sas
│  │     │  │  │  │  ├─ test_byteswap.py
│  │     │  │  │  │  ├─ test_sas.py
│  │     │  │  │  │  ├─ test_sas7bdat.py
│  │     │  │  │  │  ├─ test_xport.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ test_clipboard.py
│  │     │  │  │  ├─ test_common.py
│  │     │  │  │  ├─ test_compression.py
│  │     │  │  │  ├─ test_feather.py
│  │     │  │  │  ├─ test_fsspec.py
│  │     │  │  │  ├─ test_gcs.py
│  │     │  │  │  ├─ test_html.py
│  │     │  │  │  ├─ test_http_headers.py
│  │     │  │  │  ├─ test_iceberg.py
│  │     │  │  │  ├─ test_orc.py
│  │     │  │  │  ├─ test_parquet.py
│  │     │  │  │  ├─ test_pickle.py
│  │     │  │  │  ├─ test_s3.py
│  │     │  │  │  ├─ test_spss.py
│  │     │  │  │  ├─ test_sql.py
│  │     │  │  │  ├─ test_stata.py
│  │     │  │  │  ├─ test_util.py
│  │     │  │  │  ├─ xml
│  │     │  │  │  │  ├─ conftest.py
│  │     │  │  │  │  ├─ test_to_xml.py
│  │     │  │  │  │  ├─ test_xml.py
│  │     │  │  │  │  ├─ test_xml_dtypes.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ libs
│  │     │  │  │  ├─ test_hashtable.py
│  │     │  │  │  ├─ test_join.py
│  │     │  │  │  ├─ test_lib.py
│  │     │  │  │  ├─ test_libalgos.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ plotting
│  │     │  │  │  ├─ common.py
│  │     │  │  │  ├─ conftest.py
│  │     │  │  │  ├─ frame
│  │     │  │  │  │  ├─ test_frame.py
│  │     │  │  │  │  ├─ test_frame_color.py
│  │     │  │  │  │  ├─ test_frame_groupby.py
│  │     │  │  │  │  ├─ test_frame_legend.py
│  │     │  │  │  │  ├─ test_frame_subplots.py
│  │     │  │  │  │  ├─ test_hist_box_by.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ test_backend.py
│  │     │  │  │  ├─ test_boxplot_method.py
│  │     │  │  │  ├─ test_common.py
│  │     │  │  │  ├─ test_converter.py
│  │     │  │  │  ├─ test_datetimelike.py
│  │     │  │  │  ├─ test_groupby.py
│  │     │  │  │  ├─ test_hist_method.py
│  │     │  │  │  ├─ test_misc.py
│  │     │  │  │  ├─ test_series.py
│  │     │  │  │  ├─ test_style.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ reductions
│  │     │  │  │  ├─ test_reductions.py
│  │     │  │  │  ├─ test_stat_reductions.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ resample
│  │     │  │  │  ├─ conftest.py
│  │     │  │  │  ├─ test_base.py
│  │     │  │  │  ├─ test_datetime_index.py
│  │     │  │  │  ├─ test_period_index.py
│  │     │  │  │  ├─ test_resampler_grouper.py
│  │     │  │  │  ├─ test_resample_api.py
│  │     │  │  │  ├─ test_timedelta.py
│  │     │  │  │  ├─ test_time_grouper.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ reshape
│  │     │  │  │  ├─ concat
│  │     │  │  │  │  ├─ test_append.py
│  │     │  │  │  │  ├─ test_append_common.py
│  │     │  │  │  │  ├─ test_categorical.py
│  │     │  │  │  │  ├─ test_concat.py
│  │     │  │  │  │  ├─ test_dataframe.py
│  │     │  │  │  │  ├─ test_datetimes.py
│  │     │  │  │  │  ├─ test_empty.py
│  │     │  │  │  │  ├─ test_index.py
│  │     │  │  │  │  ├─ test_invalid.py
│  │     │  │  │  │  ├─ test_series.py
│  │     │  │  │  │  ├─ test_sort.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ merge
│  │     │  │  │  │  ├─ test_join.py
│  │     │  │  │  │  ├─ test_merge.py
│  │     │  │  │  │  ├─ test_merge_antijoin.py
│  │     │  │  │  │  ├─ test_merge_asof.py
│  │     │  │  │  │  ├─ test_merge_cross.py
│  │     │  │  │  │  ├─ test_merge_index_as_string.py
│  │     │  │  │  │  ├─ test_merge_ordered.py
│  │     │  │  │  │  ├─ test_multi.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ test_crosstab.py
│  │     │  │  │  ├─ test_cut.py
│  │     │  │  │  ├─ test_from_dummies.py
│  │     │  │  │  ├─ test_get_dummies.py
│  │     │  │  │  ├─ test_melt.py
│  │     │  │  │  ├─ test_pivot.py
│  │     │  │  │  ├─ test_pivot_multilevel.py
│  │     │  │  │  ├─ test_qcut.py
│  │     │  │  │  ├─ test_union_categoricals.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ scalar
│  │     │  │  │  ├─ interval
│  │     │  │  │  │  ├─ test_arithmetic.py
│  │     │  │  │  │  ├─ test_constructors.py
│  │     │  │  │  │  ├─ test_contains.py
│  │     │  │  │  │  ├─ test_formats.py
│  │     │  │  │  │  ├─ test_interval.py
│  │     │  │  │  │  ├─ test_overlaps.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ period
│  │     │  │  │  │  ├─ test_arithmetic.py
│  │     │  │  │  │  ├─ test_asfreq.py
│  │     │  │  │  │  ├─ test_period.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ test_nat.py
│  │     │  │  │  ├─ test_na_scalar.py
│  │     │  │  │  ├─ timedelta
│  │     │  │  │  │  ├─ methods
│  │     │  │  │  │  │  ├─ test_as_unit.py
│  │     │  │  │  │  │  ├─ test_round.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ test_arithmetic.py
│  │     │  │  │  │  ├─ test_constructors.py
│  │     │  │  │  │  ├─ test_formats.py
│  │     │  │  │  │  ├─ test_timedelta.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ timestamp
│  │     │  │  │  │  ├─ methods
│  │     │  │  │  │  │  ├─ test_as_unit.py
│  │     │  │  │  │  │  ├─ test_normalize.py
│  │     │  │  │  │  │  ├─ test_replace.py
│  │     │  │  │  │  │  ├─ test_round.py
│  │     │  │  │  │  │  ├─ test_timestamp_method.py
│  │     │  │  │  │  │  ├─ test_to_julian_date.py
│  │     │  │  │  │  │  ├─ test_to_pydatetime.py
│  │     │  │  │  │  │  ├─ test_tz_convert.py
│  │     │  │  │  │  │  ├─ test_tz_localize.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ test_arithmetic.py
│  │     │  │  │  │  ├─ test_comparisons.py
│  │     │  │  │  │  ├─ test_constructors.py
│  │     │  │  │  │  ├─ test_formats.py
│  │     │  │  │  │  ├─ test_timestamp.py
│  │     │  │  │  │  ├─ test_timezones.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ series
│  │     │  │  │  ├─ accessors
│  │     │  │  │  │  ├─ test_cat_accessor.py
│  │     │  │  │  │  ├─ test_dt_accessor.py
│  │     │  │  │  │  ├─ test_list_accessor.py
│  │     │  │  │  │  ├─ test_sparse_accessor.py
│  │     │  │  │  │  ├─ test_struct_accessor.py
│  │     │  │  │  │  ├─ test_str_accessor.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ indexing
│  │     │  │  │  │  ├─ test_datetime.py
│  │     │  │  │  │  ├─ test_delitem.py
│  │     │  │  │  │  ├─ test_get.py
│  │     │  │  │  │  ├─ test_getitem.py
│  │     │  │  │  │  ├─ test_indexing.py
│  │     │  │  │  │  ├─ test_mask.py
│  │     │  │  │  │  ├─ test_setitem.py
│  │     │  │  │  │  ├─ test_set_value.py
│  │     │  │  │  │  ├─ test_take.py
│  │     │  │  │  │  ├─ test_where.py
│  │     │  │  │  │  ├─ test_xs.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ methods
│  │     │  │  │  │  ├─ test_add_prefix_suffix.py
│  │     │  │  │  │  ├─ test_align.py
│  │     │  │  │  │  ├─ test_argsort.py
│  │     │  │  │  │  ├─ test_asof.py
│  │     │  │  │  │  ├─ test_astype.py
│  │     │  │  │  │  ├─ test_autocorr.py
│  │     │  │  │  │  ├─ test_between.py
│  │     │  │  │  │  ├─ test_case_when.py
│  │     │  │  │  │  ├─ test_clip.py
│  │     │  │  │  │  ├─ test_combine.py
│  │     │  │  │  │  ├─ test_combine_first.py
│  │     │  │  │  │  ├─ test_compare.py
│  │     │  │  │  │  ├─ test_convert_dtypes.py
│  │     │  │  │  │  ├─ test_copy.py
│  │     │  │  │  │  ├─ test_count.py
│  │     │  │  │  │  ├─ test_cov_corr.py
│  │     │  │  │  │  ├─ test_describe.py
│  │     │  │  │  │  ├─ test_diff.py
│  │     │  │  │  │  ├─ test_drop.py
│  │     │  │  │  │  ├─ test_dropna.py
│  │     │  │  │  │  ├─ test_drop_duplicates.py
│  │     │  │  │  │  ├─ test_dtypes.py
│  │     │  │  │  │  ├─ test_duplicated.py
│  │     │  │  │  │  ├─ test_equals.py
│  │     │  │  │  │  ├─ test_explode.py
│  │     │  │  │  │  ├─ test_fillna.py
│  │     │  │  │  │  ├─ test_get_numeric_data.py
│  │     │  │  │  │  ├─ test_head_tail.py
│  │     │  │  │  │  ├─ test_infer_objects.py
│  │     │  │  │  │  ├─ test_info.py
│  │     │  │  │  │  ├─ test_interpolate.py
│  │     │  │  │  │  ├─ test_isin.py
│  │     │  │  │  │  ├─ test_isna.py
│  │     │  │  │  │  ├─ test_is_monotonic.py
│  │     │  │  │  │  ├─ test_is_unique.py
│  │     │  │  │  │  ├─ test_item.py
│  │     │  │  │  │  ├─ test_map.py
│  │     │  │  │  │  ├─ test_matmul.py
│  │     │  │  │  │  ├─ test_nlargest.py
│  │     │  │  │  │  ├─ test_nunique.py
│  │     │  │  │  │  ├─ test_pct_change.py
│  │     │  │  │  │  ├─ test_pop.py
│  │     │  │  │  │  ├─ test_quantile.py
│  │     │  │  │  │  ├─ test_rank.py
│  │     │  │  │  │  ├─ test_reindex.py
│  │     │  │  │  │  ├─ test_reindex_like.py
│  │     │  │  │  │  ├─ test_rename.py
│  │     │  │  │  │  ├─ test_rename_axis.py
│  │     │  │  │  │  ├─ test_repeat.py
│  │     │  │  │  │  ├─ test_replace.py
│  │     │  │  │  │  ├─ test_reset_index.py
│  │     │  │  │  │  ├─ test_round.py
│  │     │  │  │  │  ├─ test_searchsorted.py
│  │     │  │  │  │  ├─ test_set_name.py
│  │     │  │  │  │  ├─ test_size.py
│  │     │  │  │  │  ├─ test_sort_index.py
│  │     │  │  │  │  ├─ test_sort_values.py
│  │     │  │  │  │  ├─ test_tolist.py
│  │     │  │  │  │  ├─ test_to_csv.py
│  │     │  │  │  │  ├─ test_to_dict.py
│  │     │  │  │  │  ├─ test_to_frame.py
│  │     │  │  │  │  ├─ test_to_numpy.py
│  │     │  │  │  │  ├─ test_truncate.py
│  │     │  │  │  │  ├─ test_tz_localize.py
│  │     │  │  │  │  ├─ test_unique.py
│  │     │  │  │  │  ├─ test_unstack.py
│  │     │  │  │  │  ├─ test_update.py
│  │     │  │  │  │  ├─ test_values.py
│  │     │  │  │  │  ├─ test_value_counts.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ test_api.py
│  │     │  │  │  ├─ test_arithmetic.py
│  │     │  │  │  ├─ test_arrow_interface.py
│  │     │  │  │  ├─ test_constructors.py
│  │     │  │  │  ├─ test_cumulative.py
│  │     │  │  │  ├─ test_formats.py
│  │     │  │  │  ├─ test_iteration.py
│  │     │  │  │  ├─ test_logical_ops.py
│  │     │  │  │  ├─ test_missing.py
│  │     │  │  │  ├─ test_npfuncs.py
│  │     │  │  │  ├─ test_reductions.py
│  │     │  │  │  ├─ test_subclass.py
│  │     │  │  │  ├─ test_ufunc.py
│  │     │  │  │  ├─ test_unary.py
│  │     │  │  │  ├─ test_validate.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ strings
│  │     │  │  │  ├─ conftest.py
│  │     │  │  │  ├─ test_api.py
│  │     │  │  │  ├─ test_case_justify.py
│  │     │  │  │  ├─ test_cat.py
│  │     │  │  │  ├─ test_extract.py
│  │     │  │  │  ├─ test_find_replace.py
│  │     │  │  │  ├─ test_get_dummies.py
│  │     │  │  │  ├─ test_split_partition.py
│  │     │  │  │  ├─ test_strings.py
│  │     │  │  │  ├─ test_string_array.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ test_aggregation.py
│  │     │  │  ├─ test_algos.py
│  │     │  │  ├─ test_col.py
│  │     │  │  ├─ test_common.py
│  │     │  │  ├─ test_downstream.py
│  │     │  │  ├─ test_errors.py
│  │     │  │  ├─ test_expressions.py
│  │     │  │  ├─ test_flags.py
│  │     │  │  ├─ test_multilevel.py
│  │     │  │  ├─ test_nanops.py
│  │     │  │  ├─ test_optional_dependency.py
│  │     │  │  ├─ test_register_accessor.py
│  │     │  │  ├─ test_sorting.py
│  │     │  │  ├─ test_take.py
│  │     │  │  ├─ tools
│  │     │  │  │  ├─ test_to_datetime.py
│  │     │  │  │  ├─ test_to_numeric.py
│  │     │  │  │  ├─ test_to_time.py
│  │     │  │  │  ├─ test_to_timedelta.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ tseries
│  │     │  │  │  ├─ frequencies
│  │     │  │  │  │  ├─ test_frequencies.py
│  │     │  │  │  │  ├─ test_freq_code.py
│  │     │  │  │  │  ├─ test_inference.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ holiday
│  │     │  │  │  │  ├─ test_calendar.py
│  │     │  │  │  │  ├─ test_federal.py
│  │     │  │  │  │  ├─ test_holiday.py
│  │     │  │  │  │  ├─ test_observance.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ offsets
│  │     │  │  │  │  ├─ common.py
│  │     │  │  │  │  ├─ test_business_day.py
│  │     │  │  │  │  ├─ test_business_halfyear.py
│  │     │  │  │  │  ├─ test_business_hour.py
│  │     │  │  │  │  ├─ test_business_month.py
│  │     │  │  │  │  ├─ test_business_quarter.py
│  │     │  │  │  │  ├─ test_business_year.py
│  │     │  │  │  │  ├─ test_common.py
│  │     │  │  │  │  ├─ test_custom_business_day.py
│  │     │  │  │  │  ├─ test_custom_business_hour.py
│  │     │  │  │  │  ├─ test_custom_business_month.py
│  │     │  │  │  │  ├─ test_dst.py
│  │     │  │  │  │  ├─ test_easter.py
│  │     │  │  │  │  ├─ test_fiscal.py
│  │     │  │  │  │  ├─ test_halfyear.py
│  │     │  │  │  │  ├─ test_index.py
│  │     │  │  │  │  ├─ test_month.py
│  │     │  │  │  │  ├─ test_offsets.py
│  │     │  │  │  │  ├─ test_offsets_properties.py
│  │     │  │  │  │  ├─ test_quarter.py
│  │     │  │  │  │  ├─ test_ticks.py
│  │     │  │  │  │  ├─ test_week.py
│  │     │  │  │  │  ├─ test_year.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ tslibs
│  │     │  │  │  ├─ test_api.py
│  │     │  │  │  ├─ test_array_to_datetime.py
│  │     │  │  │  ├─ test_ccalendar.py
│  │     │  │  │  ├─ test_conversion.py
│  │     │  │  │  ├─ test_fields.py
│  │     │  │  │  ├─ test_libfrequencies.py
│  │     │  │  │  ├─ test_liboffsets.py
│  │     │  │  │  ├─ test_npy_units.py
│  │     │  │  │  ├─ test_np_datetime.py
│  │     │  │  │  ├─ test_parse_iso8601.py
│  │     │  │  │  ├─ test_parsing.py
│  │     │  │  │  ├─ test_period.py
│  │     │  │  │  ├─ test_resolution.py
│  │     │  │  │  ├─ test_strptime.py
│  │     │  │  │  ├─ test_timedeltas.py
│  │     │  │  │  ├─ test_timezones.py
│  │     │  │  │  ├─ test_to_offset.py
│  │     │  │  │  ├─ test_tzconversion.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ util
│  │     │  │  │  ├─ conftest.py
│  │     │  │  │  ├─ test_assert_almost_equal.py
│  │     │  │  │  ├─ test_assert_attr_equal.py
│  │     │  │  │  ├─ test_assert_categorical_equal.py
│  │     │  │  │  ├─ test_assert_extension_array_equal.py
│  │     │  │  │  ├─ test_assert_frame_equal.py
│  │     │  │  │  ├─ test_assert_index_equal.py
│  │     │  │  │  ├─ test_assert_interval_array_equal.py
│  │     │  │  │  ├─ test_assert_numpy_array_equal.py
│  │     │  │  │  ├─ test_assert_produces_warning.py
│  │     │  │  │  ├─ test_assert_series_equal.py
│  │     │  │  │  ├─ test_deprecate.py
│  │     │  │  │  ├─ test_deprecate_kwarg.py
│  │     │  │  │  ├─ test_deprecate_nonkeyword_arguments.py
│  │     │  │  │  ├─ test_doc.py
│  │     │  │  │  ├─ test_hashing.py
│  │     │  │  │  ├─ test_numba.py
│  │     │  │  │  ├─ test_rewrite_warning.py
│  │     │  │  │  ├─ test_shares_memory.py
│  │     │  │  │  ├─ test_show_versions.py
│  │     │  │  │  ├─ test_util.py
│  │     │  │  │  ├─ test_validate_args.py
│  │     │  │  │  ├─ test_validate_args_and_kwargs.py
│  │     │  │  │  ├─ test_validate_inclusive.py
│  │     │  │  │  ├─ test_validate_kwargs.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ window
│  │     │  │  │  ├─ conftest.py
│  │     │  │  │  ├─ moments
│  │     │  │  │  │  ├─ conftest.py
│  │     │  │  │  │  ├─ test_moments_consistency_ewm.py
│  │     │  │  │  │  ├─ test_moments_consistency_expanding.py
│  │     │  │  │  │  ├─ test_moments_consistency_rolling.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ test_api.py
│  │     │  │  │  ├─ test_apply.py
│  │     │  │  │  ├─ test_base_indexer.py
│  │     │  │  │  ├─ test_cython_aggregations.py
│  │     │  │  │  ├─ test_dtypes.py
│  │     │  │  │  ├─ test_ewm.py
│  │     │  │  │  ├─ test_expanding.py
│  │     │  │  │  ├─ test_groupby.py
│  │     │  │  │  ├─ test_numba.py
│  │     │  │  │  ├─ test_online.py
│  │     │  │  │  ├─ test_pairwise.py
│  │     │  │  │  ├─ test_rolling.py
│  │     │  │  │  ├─ test_rolling_functions.py
│  │     │  │  │  ├─ test_rolling_quantile.py
│  │     │  │  │  ├─ test_rolling_skew_kurt.py
│  │     │  │  │  ├─ test_timeseries_window.py
│  │     │  │  │  ├─ test_win_type.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ tseries
│  │     │  │  ├─ api.py
│  │     │  │  ├─ frequencies.py
│  │     │  │  ├─ holiday.py
│  │     │  │  ├─ offsets.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ util
│  │     │  │  ├─ version
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ _decorators.py
│  │     │  │  ├─ _doctools.py
│  │     │  │  ├─ _exceptions.py
│  │     │  │  ├─ _print_versions.py
│  │     │  │  ├─ _tester.py
│  │     │  │  ├─ _test_decorators.py
│  │     │  │  ├─ _validators.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _config
│  │     │  │  ├─ config.py
│  │     │  │  ├─ dates.py
│  │     │  │  ├─ display.py
│  │     │  │  ├─ localization.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _libs
│  │     │  │  ├─ algos.cp314-win_amd64.lib
│  │     │  │  ├─ algos.cp314-win_amd64.pyd
│  │     │  │  ├─ algos.pyi
│  │     │  │  ├─ arrays.cp314-win_amd64.lib
│  │     │  │  ├─ arrays.cp314-win_amd64.pyd
│  │     │  │  ├─ arrays.pyi
│  │     │  │  ├─ byteswap.cp314-win_amd64.lib
│  │     │  │  ├─ byteswap.cp314-win_amd64.pyd
│  │     │  │  ├─ byteswap.pyi
│  │     │  │  ├─ groupby.cp314-win_amd64.lib
│  │     │  │  ├─ groupby.cp314-win_amd64.pyd
│  │     │  │  ├─ groupby.pyi
│  │     │  │  ├─ hashing.cp314-win_amd64.lib
│  │     │  │  ├─ hashing.cp314-win_amd64.pyd
│  │     │  │  ├─ hashing.pyi
│  │     │  │  ├─ hashtable.cp314-win_amd64.lib
│  │     │  │  ├─ hashtable.cp314-win_amd64.pyd
│  │     │  │  ├─ hashtable.pyi
│  │     │  │  ├─ index.cp314-win_amd64.lib
│  │     │  │  ├─ index.cp314-win_amd64.pyd
│  │     │  │  ├─ index.pyi
│  │     │  │  ├─ indexing.cp314-win_amd64.lib
│  │     │  │  ├─ indexing.cp314-win_amd64.pyd
│  │     │  │  ├─ indexing.pyi
│  │     │  │  ├─ internals.cp314-win_amd64.lib
│  │     │  │  ├─ internals.cp314-win_amd64.pyd
│  │     │  │  ├─ internals.pyi
│  │     │  │  ├─ interval.cp314-win_amd64.lib
│  │     │  │  ├─ interval.cp314-win_amd64.pyd
│  │     │  │  ├─ interval.pyi
│  │     │  │  ├─ join.cp314-win_amd64.lib
│  │     │  │  ├─ join.cp314-win_amd64.pyd
│  │     │  │  ├─ join.pyi
│  │     │  │  ├─ json.cp314-win_amd64.lib
│  │     │  │  ├─ json.cp314-win_amd64.pyd
│  │     │  │  ├─ json.pyi
│  │     │  │  ├─ lib.cp314-win_amd64.lib
│  │     │  │  ├─ lib.cp314-win_amd64.pyd
│  │     │  │  ├─ lib.pyi
│  │     │  │  ├─ missing.cp314-win_amd64.lib
│  │     │  │  ├─ missing.cp314-win_amd64.pyd
│  │     │  │  ├─ missing.pyi
│  │     │  │  ├─ ops.cp314-win_amd64.lib
│  │     │  │  ├─ ops.cp314-win_amd64.pyd
│  │     │  │  ├─ ops.pyi
│  │     │  │  ├─ ops_dispatch.cp314-win_amd64.lib
│  │     │  │  ├─ ops_dispatch.cp314-win_amd64.pyd
│  │     │  │  ├─ ops_dispatch.pyi
│  │     │  │  ├─ pandas_datetime.cp314-win_amd64.lib
│  │     │  │  ├─ pandas_datetime.cp314-win_amd64.pyd
│  │     │  │  ├─ pandas_parser.cp314-win_amd64.lib
│  │     │  │  ├─ pandas_parser.cp314-win_amd64.pyd
│  │     │  │  ├─ parsers.cp314-win_amd64.lib
│  │     │  │  ├─ parsers.cp314-win_amd64.pyd
│  │     │  │  ├─ parsers.pyi
│  │     │  │  ├─ properties.cp314-win_amd64.lib
│  │     │  │  ├─ properties.cp314-win_amd64.pyd
│  │     │  │  ├─ properties.pyi
│  │     │  │  ├─ reshape.cp314-win_amd64.lib
│  │     │  │  ├─ reshape.cp314-win_amd64.pyd
│  │     │  │  ├─ reshape.pyi
│  │     │  │  ├─ sas.cp314-win_amd64.lib
│  │     │  │  ├─ sas.cp314-win_amd64.pyd
│  │     │  │  ├─ sas.pyi
│  │     │  │  ├─ sparse.cp314-win_amd64.lib
│  │     │  │  ├─ sparse.cp314-win_amd64.pyd
│  │     │  │  ├─ sparse.pyi
│  │     │  │  ├─ testing.cp314-win_amd64.lib
│  │     │  │  ├─ testing.cp314-win_amd64.pyd
│  │     │  │  ├─ testing.pyi
│  │     │  │  ├─ tslib.cp314-win_amd64.lib
│  │     │  │  ├─ tslib.cp314-win_amd64.pyd
│  │     │  │  ├─ tslib.pyi
│  │     │  │  ├─ tslibs
│  │     │  │  │  ├─ base.cp314-win_amd64.lib
│  │     │  │  │  ├─ base.cp314-win_amd64.pyd
│  │     │  │  │  ├─ ccalendar.cp314-win_amd64.lib
│  │     │  │  │  ├─ ccalendar.cp314-win_amd64.pyd
│  │     │  │  │  ├─ ccalendar.pyi
│  │     │  │  │  ├─ conversion.cp314-win_amd64.lib
│  │     │  │  │  ├─ conversion.cp314-win_amd64.pyd
│  │     │  │  │  ├─ conversion.pyi
│  │     │  │  │  ├─ dtypes.cp314-win_amd64.lib
│  │     │  │  │  ├─ dtypes.cp314-win_amd64.pyd
│  │     │  │  │  ├─ dtypes.pyi
│  │     │  │  │  ├─ fields.cp314-win_amd64.lib
│  │     │  │  │  ├─ fields.cp314-win_amd64.pyd
│  │     │  │  │  ├─ fields.pyi
│  │     │  │  │  ├─ nattype.cp314-win_amd64.lib
│  │     │  │  │  ├─ nattype.cp314-win_amd64.pyd
│  │     │  │  │  ├─ nattype.pyi
│  │     │  │  │  ├─ np_datetime.cp314-win_amd64.lib
│  │     │  │  │  ├─ np_datetime.cp314-win_amd64.pyd
│  │     │  │  │  ├─ np_datetime.pyi
│  │     │  │  │  ├─ offsets.cp314-win_amd64.lib
│  │     │  │  │  ├─ offsets.cp314-win_amd64.pyd
│  │     │  │  │  ├─ offsets.pyi
│  │     │  │  │  ├─ parsing.cp314-win_amd64.lib
│  │     │  │  │  ├─ parsing.cp314-win_amd64.pyd
│  │     │  │  │  ├─ parsing.pyi
│  │     │  │  │  ├─ period.cp314-win_amd64.lib
│  │     │  │  │  ├─ period.cp314-win_amd64.pyd
│  │     │  │  │  ├─ period.pyi
│  │     │  │  │  ├─ strptime.cp314-win_amd64.lib
│  │     │  │  │  ├─ strptime.cp314-win_amd64.pyd
│  │     │  │  │  ├─ strptime.pyi
│  │     │  │  │  ├─ timedeltas.cp314-win_amd64.lib
│  │     │  │  │  ├─ timedeltas.cp314-win_amd64.pyd
│  │     │  │  │  ├─ timedeltas.pyi
│  │     │  │  │  ├─ timestamps.cp314-win_amd64.lib
│  │     │  │  │  ├─ timestamps.cp314-win_amd64.pyd
│  │     │  │  │  ├─ timestamps.pyi
│  │     │  │  │  ├─ timezones.cp314-win_amd64.lib
│  │     │  │  │  ├─ timezones.cp314-win_amd64.pyd
│  │     │  │  │  ├─ timezones.pyi
│  │     │  │  │  ├─ tzconversion.cp314-win_amd64.lib
│  │     │  │  │  ├─ tzconversion.cp314-win_amd64.pyd
│  │     │  │  │  ├─ tzconversion.pyi
│  │     │  │  │  ├─ vectorized.cp314-win_amd64.lib
│  │     │  │  │  ├─ vectorized.cp314-win_amd64.pyd
│  │     │  │  │  ├─ vectorized.pyi
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ window
│  │     │  │  │  ├─ aggregations.cp314-win_amd64.lib
│  │     │  │  │  ├─ aggregations.cp314-win_amd64.pyd
│  │     │  │  │  ├─ aggregations.pyi
│  │     │  │  │  ├─ indexers.cp314-win_amd64.lib
│  │     │  │  │  ├─ indexers.cp314-win_amd64.pyd
│  │     │  │  │  ├─ indexers.pyi
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ writers.cp314-win_amd64.lib
│  │     │  │  ├─ writers.cp314-win_amd64.pyd
│  │     │  │  ├─ writers.pyi
│  │     │  │  ├─ _cyutility.cp314-win_amd64.lib
│  │     │  │  ├─ _cyutility.cp314-win_amd64.pyd
│  │     │  │  └─ __init__.py
│  │     │  ├─ _testing
│  │     │  │  ├─ asserters.py
│  │     │  │  ├─ compat.py
│  │     │  │  ├─ contexts.py
│  │     │  │  ├─ _hypothesis.py
│  │     │  │  ├─ _io.py
│  │     │  │  ├─ _warnings.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _typing.py
│  │     │  ├─ _version.py
│  │     │  ├─ _version_meson.py
│  │     │  └─ __init__.py
│  │     ├─ pandas-3.0.6.dist-info
│  │     │  ├─ DELVEWHEEL
│  │     │  ├─ entry_points.txt
│  │     │  ├─ INSTALLER
│  │     │  ├─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ REQUESTED
│  │     │  └─ WHEEL
│  │     ├─ pandas.libs
│  │     │  └─ msvcp140-a4c2229bdc2a2a630acdc095b4d86008.dll
│  │     ├─ pip
│  │     │  ├─ py.typed
│  │     │  ├─ _internal
│  │     │  │  ├─ build_env.py
│  │     │  │  ├─ cache.py
│  │     │  │  ├─ cli
│  │     │  │  │  ├─ autocompletion.py
│  │     │  │  │  ├─ base_command.py
│  │     │  │  │  ├─ cmdoptions.py
│  │     │  │  │  ├─ command_context.py
│  │     │  │  │  ├─ index_command.py
│  │     │  │  │  ├─ main.py
│  │     │  │  │  ├─ main_parser.py
│  │     │  │  │  ├─ parser.py
│  │     │  │  │  ├─ progress_bars.py
│  │     │  │  │  ├─ req_command.py
│  │     │  │  │  ├─ spinners.py
│  │     │  │  │  ├─ status_codes.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ commands
│  │     │  │  │  ├─ cache.py
│  │     │  │  │  ├─ check.py
│  │     │  │  │  ├─ completion.py
│  │     │  │  │  ├─ configuration.py
│  │     │  │  │  ├─ debug.py
│  │     │  │  │  ├─ download.py
│  │     │  │  │  ├─ freeze.py
│  │     │  │  │  ├─ hash.py
│  │     │  │  │  ├─ help.py
│  │     │  │  │  ├─ index.py
│  │     │  │  │  ├─ inspect.py
│  │     │  │  │  ├─ install.py
│  │     │  │  │  ├─ list.py
│  │     │  │  │  ├─ lock.py
│  │     │  │  │  ├─ search.py
│  │     │  │  │  ├─ show.py
│  │     │  │  │  ├─ uninstall.py
│  │     │  │  │  ├─ wheel.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ configuration.py
│  │     │  │  ├─ distributions
│  │     │  │  │  ├─ base.py
│  │     │  │  │  ├─ installed.py
│  │     │  │  │  ├─ sdist.py
│  │     │  │  │  ├─ wheel.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ exceptions.py
│  │     │  │  ├─ index
│  │     │  │  │  ├─ collector.py
│  │     │  │  │  ├─ package_finder.py
│  │     │  │  │  ├─ sources.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ locations
│  │     │  │  │  ├─ base.py
│  │     │  │  │  ├─ _distutils.py
│  │     │  │  │  ├─ _sysconfig.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ main.py
│  │     │  │  ├─ metadata
│  │     │  │  │  ├─ base.py
│  │     │  │  │  ├─ importlib
│  │     │  │  │  │  ├─ _compat.py
│  │     │  │  │  │  ├─ _dists.py
│  │     │  │  │  │  ├─ _envs.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ pkg_resources.py
│  │     │  │  │  ├─ _json.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ models
│  │     │  │  │  ├─ candidate.py
│  │     │  │  │  ├─ direct_url.py
│  │     │  │  │  ├─ format_control.py
│  │     │  │  │  ├─ index.py
│  │     │  │  │  ├─ installation_report.py
│  │     │  │  │  ├─ link.py
│  │     │  │  │  ├─ pylock.py
│  │     │  │  │  ├─ scheme.py
│  │     │  │  │  ├─ search_scope.py
│  │     │  │  │  ├─ selection_prefs.py
│  │     │  │  │  ├─ target_python.py
│  │     │  │  │  ├─ wheel.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ network
│  │     │  │  │  ├─ auth.py
│  │     │  │  │  ├─ cache.py
│  │     │  │  │  ├─ download.py
│  │     │  │  │  ├─ lazy_wheel.py
│  │     │  │  │  ├─ session.py
│  │     │  │  │  ├─ utils.py
│  │     │  │  │  ├─ xmlrpc.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ operations
│  │     │  │  │  ├─ build
│  │     │  │  │  │  ├─ build_tracker.py
│  │     │  │  │  │  ├─ metadata.py
│  │     │  │  │  │  ├─ metadata_editable.py
│  │     │  │  │  │  ├─ wheel.py
│  │     │  │  │  │  ├─ wheel_editable.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ check.py
│  │     │  │  │  ├─ freeze.py
│  │     │  │  │  ├─ install
│  │     │  │  │  │  ├─ wheel.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ prepare.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ pyproject.py
│  │     │  │  ├─ req
│  │     │  │  │  ├─ constructors.py
│  │     │  │  │  ├─ req_dependency_group.py
│  │     │  │  │  ├─ req_file.py
│  │     │  │  │  ├─ req_install.py
│  │     │  │  │  ├─ req_set.py
│  │     │  │  │  ├─ req_uninstall.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ resolution
│  │     │  │  │  ├─ base.py
│  │     │  │  │  ├─ legacy
│  │     │  │  │  │  ├─ resolver.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ resolvelib
│  │     │  │  │  │  ├─ base.py
│  │     │  │  │  │  ├─ candidates.py
│  │     │  │  │  │  ├─ factory.py
│  │     │  │  │  │  ├─ found_candidates.py
│  │     │  │  │  │  ├─ provider.py
│  │     │  │  │  │  ├─ reporter.py
│  │     │  │  │  │  ├─ requirements.py
│  │     │  │  │  │  ├─ resolver.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ self_outdated_check.py
│  │     │  │  ├─ utils
│  │     │  │  │  ├─ appdirs.py
│  │     │  │  │  ├─ compat.py
│  │     │  │  │  ├─ compatibility_tags.py
│  │     │  │  │  ├─ datetime.py
│  │     │  │  │  ├─ deprecation.py
│  │     │  │  │  ├─ direct_url_helpers.py
│  │     │  │  │  ├─ egg_link.py
│  │     │  │  │  ├─ entrypoints.py
│  │     │  │  │  ├─ filesystem.py
│  │     │  │  │  ├─ filetypes.py
│  │     │  │  │  ├─ glibc.py
│  │     │  │  │  ├─ hashes.py
│  │     │  │  │  ├─ logging.py
│  │     │  │  │  ├─ misc.py
│  │     │  │  │  ├─ packaging.py
│  │     │  │  │  ├─ retry.py
│  │     │  │  │  ├─ subprocess.py
│  │     │  │  │  ├─ temp_dir.py
│  │     │  │  │  ├─ unpacking.py
│  │     │  │  │  ├─ urls.py
│  │     │  │  │  ├─ virtualenv.py
│  │     │  │  │  ├─ wheel.py
│  │     │  │  │  ├─ _jaraco_text.py
│  │     │  │  │  ├─ _log.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ vcs
│  │     │  │  │  ├─ bazaar.py
│  │     │  │  │  ├─ git.py
│  │     │  │  │  ├─ mercurial.py
│  │     │  │  │  ├─ subversion.py
│  │     │  │  │  ├─ versioncontrol.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ wheel_builder.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _vendor
│  │     │  │  ├─ cachecontrol
│  │     │  │  │  ├─ adapter.py
│  │     │  │  │  ├─ cache.py
│  │     │  │  │  ├─ caches
│  │     │  │  │  │  ├─ file_cache.py
│  │     │  │  │  │  ├─ redis_cache.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ controller.py
│  │     │  │  │  ├─ filewrapper.py
│  │     │  │  │  ├─ heuristics.py
│  │     │  │  │  ├─ LICENSE.txt
│  │     │  │  │  ├─ py.typed
│  │     │  │  │  ├─ serialize.py
│  │     │  │  │  ├─ wrapper.py
│  │     │  │  │  ├─ _cmd.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ certifi
│  │     │  │  │  ├─ cacert.pem
│  │     │  │  │  ├─ core.py
│  │     │  │  │  ├─ LICENSE
│  │     │  │  │  ├─ py.typed
│  │     │  │  │  ├─ __init__.py
│  │     │  │  │  └─ __main__.py
│  │     │  │  ├─ dependency_groups
│  │     │  │  │  ├─ LICENSE.txt
│  │     │  │  │  ├─ py.typed
│  │     │  │  │  ├─ _implementation.py
│  │     │  │  │  ├─ _lint_dependency_groups.py
│  │     │  │  │  ├─ _pip_wrapper.py
│  │     │  │  │  ├─ _toml_compat.py
│  │     │  │  │  ├─ __init__.py
│  │     │  │  │  └─ __main__.py
│  │     │  │  ├─ distlib
│  │     │  │  │  ├─ compat.py
│  │     │  │  │  ├─ LICENSE.txt
│  │     │  │  │  ├─ resources.py
│  │     │  │  │  ├─ scripts.py
│  │     │  │  │  ├─ t32.exe
│  │     │  │  │  ├─ t64-arm.exe
│  │     │  │  │  ├─ t64.exe
│  │     │  │  │  ├─ util.py
│  │     │  │  │  ├─ w32.exe
│  │     │  │  │  ├─ w64-arm.exe
│  │     │  │  │  ├─ w64.exe
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ distro
│  │     │  │  │  ├─ distro.py
│  │     │  │  │  ├─ LICENSE
│  │     │  │  │  ├─ py.typed
│  │     │  │  │  ├─ __init__.py
│  │     │  │  │  └─ __main__.py
│  │     │  │  ├─ idna
│  │     │  │  │  ├─ codec.py
│  │     │  │  │  ├─ compat.py
│  │     │  │  │  ├─ core.py
│  │     │  │  │  ├─ idnadata.py
│  │     │  │  │  ├─ intranges.py
│  │     │  │  │  ├─ LICENSE.md
│  │     │  │  │  ├─ package_data.py
│  │     │  │  │  ├─ py.typed
│  │     │  │  │  ├─ uts46data.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ msgpack
│  │     │  │  │  ├─ COPYING
│  │     │  │  │  ├─ exceptions.py
│  │     │  │  │  ├─ ext.py
│  │     │  │  │  ├─ fallback.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ packaging
│  │     │  │  │  ├─ LICENSE
│  │     │  │  │  ├─ LICENSE.APACHE
│  │     │  │  │  ├─ LICENSE.BSD
│  │     │  │  │  ├─ licenses
│  │     │  │  │  │  ├─ _spdx.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ markers.py
│  │     │  │  │  ├─ metadata.py
│  │     │  │  │  ├─ py.typed
│  │     │  │  │  ├─ requirements.py
│  │     │  │  │  ├─ specifiers.py
│  │     │  │  │  ├─ tags.py
│  │     │  │  │  ├─ utils.py
│  │     │  │  │  ├─ version.py
│  │     │  │  │  ├─ _elffile.py
│  │     │  │  │  ├─ _manylinux.py
│  │     │  │  │  ├─ _musllinux.py
│  │     │  │  │  ├─ _parser.py
│  │     │  │  │  ├─ _structures.py
│  │     │  │  │  ├─ _tokenizer.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ pkg_resources
│  │     │  │  │  ├─ LICENSE
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ platformdirs
│  │     │  │  │  ├─ android.py
│  │     │  │  │  ├─ api.py
│  │     │  │  │  ├─ LICENSE
│  │     │  │  │  ├─ macos.py
│  │     │  │  │  ├─ py.typed
│  │     │  │  │  ├─ unix.py
│  │     │  │  │  ├─ version.py
│  │     │  │  │  ├─ windows.py
│  │     │  │  │  ├─ __init__.py
│  │     │  │  │  └─ __main__.py
│  │     │  │  ├─ pygments
│  │     │  │  │  ├─ console.py
│  │     │  │  │  ├─ filter.py
│  │     │  │  │  ├─ filters
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ formatter.py
│  │     │  │  │  ├─ formatters
│  │     │  │  │  │  ├─ _mapping.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ lexer.py
│  │     │  │  │  ├─ lexers
│  │     │  │  │  │  ├─ python.py
│  │     │  │  │  │  ├─ _mapping.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ LICENSE
│  │     │  │  │  ├─ modeline.py
│  │     │  │  │  ├─ plugin.py
│  │     │  │  │  ├─ regexopt.py
│  │     │  │  │  ├─ scanner.py
│  │     │  │  │  ├─ sphinxext.py
│  │     │  │  │  ├─ style.py
│  │     │  │  │  ├─ styles
│  │     │  │  │  │  ├─ _mapping.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ token.py
│  │     │  │  │  ├─ unistring.py
│  │     │  │  │  ├─ util.py
│  │     │  │  │  ├─ __init__.py
│  │     │  │  │  └─ __main__.py
│  │     │  │  ├─ pyproject_hooks
│  │     │  │  │  ├─ LICENSE
│  │     │  │  │  ├─ py.typed
│  │     │  │  │  ├─ _impl.py
│  │     │  │  │  ├─ _in_process
│  │     │  │  │  │  ├─ _in_process.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ README.rst
│  │     │  │  ├─ requests
│  │     │  │  │  ├─ adapters.py
│  │     │  │  │  ├─ api.py
│  │     │  │  │  ├─ auth.py
│  │     │  │  │  ├─ certs.py
│  │     │  │  │  ├─ compat.py
│  │     │  │  │  ├─ cookies.py
│  │     │  │  │  ├─ exceptions.py
│  │     │  │  │  ├─ help.py
│  │     │  │  │  ├─ hooks.py
│  │     │  │  │  ├─ LICENSE
│  │     │  │  │  ├─ models.py
│  │     │  │  │  ├─ packages.py
│  │     │  │  │  ├─ sessions.py
│  │     │  │  │  ├─ status_codes.py
│  │     │  │  │  ├─ structures.py
│  │     │  │  │  ├─ utils.py
│  │     │  │  │  ├─ _internal_utils.py
│  │     │  │  │  ├─ __init__.py
│  │     │  │  │  └─ __version__.py
│  │     │  │  ├─ resolvelib
│  │     │  │  │  ├─ LICENSE
│  │     │  │  │  ├─ providers.py
│  │     │  │  │  ├─ py.typed
│  │     │  │  │  ├─ reporters.py
│  │     │  │  │  ├─ resolvers
│  │     │  │  │  │  ├─ abstract.py
│  │     │  │  │  │  ├─ criterion.py
│  │     │  │  │  │  ├─ exceptions.py
│  │     │  │  │  │  ├─ resolution.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ structs.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ rich
│  │     │  │  │  ├─ abc.py
│  │     │  │  │  ├─ align.py
│  │     │  │  │  ├─ ansi.py
│  │     │  │  │  ├─ bar.py
│  │     │  │  │  ├─ box.py
│  │     │  │  │  ├─ cells.py
│  │     │  │  │  ├─ color.py
│  │     │  │  │  ├─ color_triplet.py
│  │     │  │  │  ├─ columns.py
│  │     │  │  │  ├─ console.py
│  │     │  │  │  ├─ constrain.py
│  │     │  │  │  ├─ containers.py
│  │     │  │  │  ├─ control.py
│  │     │  │  │  ├─ default_styles.py
│  │     │  │  │  ├─ diagnose.py
│  │     │  │  │  ├─ emoji.py
│  │     │  │  │  ├─ errors.py
│  │     │  │  │  ├─ filesize.py
│  │     │  │  │  ├─ file_proxy.py
│  │     │  │  │  ├─ highlighter.py
│  │     │  │  │  ├─ json.py
│  │     │  │  │  ├─ jupyter.py
│  │     │  │  │  ├─ layout.py
│  │     │  │  │  ├─ LICENSE
│  │     │  │  │  ├─ live.py
│  │     │  │  │  ├─ live_render.py
│  │     │  │  │  ├─ logging.py
│  │     │  │  │  ├─ markup.py
│  │     │  │  │  ├─ measure.py
│  │     │  │  │  ├─ padding.py
│  │     │  │  │  ├─ pager.py
│  │     │  │  │  ├─ palette.py
│  │     │  │  │  ├─ panel.py
│  │     │  │  │  ├─ pretty.py
│  │     │  │  │  ├─ progress.py
│  │     │  │  │  ├─ progress_bar.py
│  │     │  │  │  ├─ prompt.py
│  │     │  │  │  ├─ protocol.py
│  │     │  │  │  ├─ py.typed
│  │     │  │  │  ├─ region.py
│  │     │  │  │  ├─ repr.py
│  │     │  │  │  ├─ rule.py
│  │     │  │  │  ├─ scope.py
│  │     │  │  │  ├─ screen.py
│  │     │  │  │  ├─ segment.py
│  │     │  │  │  ├─ spinner.py
│  │     │  │  │  ├─ status.py
│  │     │  │  │  ├─ style.py
│  │     │  │  │  ├─ styled.py
│  │     │  │  │  ├─ syntax.py
│  │     │  │  │  ├─ table.py
│  │     │  │  │  ├─ terminal_theme.py
│  │     │  │  │  ├─ text.py
│  │     │  │  │  ├─ theme.py
│  │     │  │  │  ├─ themes.py
│  │     │  │  │  ├─ traceback.py
│  │     │  │  │  ├─ tree.py
│  │     │  │  │  ├─ _cell_widths.py
│  │     │  │  │  ├─ _emoji_codes.py
│  │     │  │  │  ├─ _emoji_replace.py
│  │     │  │  │  ├─ _export_format.py
│  │     │  │  │  ├─ _extension.py
│  │     │  │  │  ├─ _fileno.py
│  │     │  │  │  ├─ _inspect.py
│  │     │  │  │  ├─ _log_render.py
│  │     │  │  │  ├─ _loop.py
│  │     │  │  │  ├─ _null_file.py
│  │     │  │  │  ├─ _palettes.py
│  │     │  │  │  ├─ _pick.py
│  │     │  │  │  ├─ _ratio.py
│  │     │  │  │  ├─ _spinners.py
│  │     │  │  │  ├─ _stack.py
│  │     │  │  │  ├─ _timer.py
│  │     │  │  │  ├─ _win32_console.py
│  │     │  │  │  ├─ _windows.py
│  │     │  │  │  ├─ _windows_renderer.py
│  │     │  │  │  ├─ _wrap.py
│  │     │  │  │  ├─ __init__.py
│  │     │  │  │  └─ __main__.py
│  │     │  │  ├─ tomli
│  │     │  │  │  ├─ LICENSE
│  │     │  │  │  ├─ py.typed
│  │     │  │  │  ├─ _parser.py
│  │     │  │  │  ├─ _re.py
│  │     │  │  │  ├─ _types.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ tomli_w
│  │     │  │  │  ├─ LICENSE
│  │     │  │  │  ├─ py.typed
│  │     │  │  │  ├─ _writer.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ truststore
│  │     │  │  │  ├─ LICENSE
│  │     │  │  │  ├─ py.typed
│  │     │  │  │  ├─ _api.py
│  │     │  │  │  ├─ _macos.py
│  │     │  │  │  ├─ _openssl.py
│  │     │  │  │  ├─ _ssl_constants.py
│  │     │  │  │  ├─ _windows.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ urllib3
│  │     │  │  │  ├─ connection.py
│  │     │  │  │  ├─ connectionpool.py
│  │     │  │  │  ├─ contrib
│  │     │  │  │  │  ├─ appengine.py
│  │     │  │  │  │  ├─ ntlmpool.py
│  │     │  │  │  │  ├─ pyopenssl.py
│  │     │  │  │  │  ├─ securetransport.py
│  │     │  │  │  │  ├─ socks.py
│  │     │  │  │  │  ├─ _appengine_environ.py
│  │     │  │  │  │  ├─ _securetransport
│  │     │  │  │  │  │  ├─ bindings.py
│  │     │  │  │  │  │  ├─ low_level.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ exceptions.py
│  │     │  │  │  ├─ fields.py
│  │     │  │  │  ├─ filepost.py
│  │     │  │  │  ├─ LICENSE.txt
│  │     │  │  │  ├─ packages
│  │     │  │  │  │  ├─ backports
│  │     │  │  │  │  │  ├─ makefile.py
│  │     │  │  │  │  │  ├─ weakref_finalize.py
│  │     │  │  │  │  │  └─ __init__.py
│  │     │  │  │  │  ├─ six.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ poolmanager.py
│  │     │  │  │  ├─ request.py
│  │     │  │  │  ├─ response.py
│  │     │  │  │  ├─ util
│  │     │  │  │  │  ├─ connection.py
│  │     │  │  │  │  ├─ proxy.py
│  │     │  │  │  │  ├─ queue.py
│  │     │  │  │  │  ├─ request.py
│  │     │  │  │  │  ├─ response.py
│  │     │  │  │  │  ├─ retry.py
│  │     │  │  │  │  ├─ ssltransport.py
│  │     │  │  │  │  ├─ ssl_.py
│  │     │  │  │  │  ├─ ssl_match_hostname.py
│  │     │  │  │  │  ├─ timeout.py
│  │     │  │  │  │  ├─ url.py
│  │     │  │  │  │  ├─ wait.py
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ _collections.py
│  │     │  │  │  ├─ _version.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ vendor.txt
│  │     │  │  └─ __init__.py
│  │     │  ├─ __init__.py
│  │     │  ├─ __main__.py
│  │     │  └─ __pip-runner__.py
│  │     ├─ pip-25.3.dist-info
│  │     │  ├─ entry_points.txt
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  ├─ AUTHORS.txt
│  │     │  │  ├─ LICENSE.txt
│  │     │  │  └─ src
│  │     │  │     └─ pip
│  │     │  │        └─ _vendor
│  │     │  │           ├─ cachecontrol
│  │     │  │           │  └─ LICENSE.txt
│  │     │  │           ├─ certifi
│  │     │  │           │  └─ LICENSE
│  │     │  │           ├─ dependency_groups
│  │     │  │           │  └─ LICENSE.txt
│  │     │  │           ├─ distlib
│  │     │  │           │  └─ LICENSE.txt
│  │     │  │           ├─ distro
│  │     │  │           │  └─ LICENSE
│  │     │  │           ├─ idna
│  │     │  │           │  └─ LICENSE.md
│  │     │  │           ├─ msgpack
│  │     │  │           │  └─ COPYING
│  │     │  │           ├─ packaging
│  │     │  │           │  ├─ LICENSE
│  │     │  │           │  ├─ LICENSE.APACHE
│  │     │  │           │  └─ LICENSE.BSD
│  │     │  │           ├─ pkg_resources
│  │     │  │           │  └─ LICENSE
│  │     │  │           ├─ platformdirs
│  │     │  │           │  └─ LICENSE
│  │     │  │           ├─ pygments
│  │     │  │           │  └─ LICENSE
│  │     │  │           ├─ pyproject_hooks
│  │     │  │           │  └─ LICENSE
│  │     │  │           ├─ requests
│  │     │  │           │  └─ LICENSE
│  │     │  │           ├─ resolvelib
│  │     │  │           │  └─ LICENSE
│  │     │  │           ├─ rich
│  │     │  │           │  └─ LICENSE
│  │     │  │           ├─ tomli
│  │     │  │           │  └─ LICENSE
│  │     │  │           ├─ tomli_w
│  │     │  │           │  └─ LICENSE
│  │     │  │           ├─ truststore
│  │     │  │           │  └─ LICENSE
│  │     │  │           └─ urllib3
│  │     │  │              └─ LICENSE.txt
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ REQUESTED
│  │     │  └─ WHEEL
│  │     ├─ pycparser
│  │     │  ├─ ast_transforms.py
│  │     │  ├─ c_ast.py
│  │     │  ├─ c_generator.py
│  │     │  ├─ c_lexer.py
│  │     │  ├─ c_parser.py
│  │     │  ├─ _ast_gen.py
│  │     │  ├─ _c_ast.cfg
│  │     │  └─ __init__.py
│  │     ├─ pycparser-3.0.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ top_level.txt
│  │     │  └─ WHEEL
│  │     ├─ pydantic
│  │     │  ├─ aliases.py
│  │     │  ├─ alias_generators.py
│  │     │  ├─ annotated_handlers.py
│  │     │  ├─ class_validators.py
│  │     │  ├─ color.py
│  │     │  ├─ config.py
│  │     │  ├─ dataclasses.py
│  │     │  ├─ datetime_parse.py
│  │     │  ├─ decorator.py
│  │     │  ├─ deprecated
│  │     │  │  ├─ class_validators.py
│  │     │  │  ├─ config.py
│  │     │  │  ├─ copy_internals.py
│  │     │  │  ├─ decorator.py
│  │     │  │  ├─ json.py
│  │     │  │  ├─ parse.py
│  │     │  │  ├─ tools.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ env_settings.py
│  │     │  ├─ errors.py
│  │     │  ├─ error_wrappers.py
│  │     │  ├─ experimental
│  │     │  │  ├─ arguments_schema.py
│  │     │  │  ├─ missing_sentinel.py
│  │     │  │  ├─ pipeline.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ fields.py
│  │     │  ├─ functional_serializers.py
│  │     │  ├─ functional_validators.py
│  │     │  ├─ generics.py
│  │     │  ├─ json.py
│  │     │  ├─ json_schema.py
│  │     │  ├─ main.py
│  │     │  ├─ mypy.py
│  │     │  ├─ networks.py
│  │     │  ├─ parse.py
│  │     │  ├─ plugin
│  │     │  │  ├─ _loader.py
│  │     │  │  ├─ _schema_validator.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ py.typed
│  │     │  ├─ root_model.py
│  │     │  ├─ schema.py
│  │     │  ├─ tools.py
│  │     │  ├─ types.py
│  │     │  ├─ type_adapter.py
│  │     │  ├─ typing.py
│  │     │  ├─ utils.py
│  │     │  ├─ v1
│  │     │  │  ├─ annotated_types.py
│  │     │  │  ├─ class_validators.py
│  │     │  │  ├─ color.py
│  │     │  │  ├─ config.py
│  │     │  │  ├─ dataclasses.py
│  │     │  │  ├─ datetime_parse.py
│  │     │  │  ├─ decorator.py
│  │     │  │  ├─ env_settings.py
│  │     │  │  ├─ errors.py
│  │     │  │  ├─ error_wrappers.py
│  │     │  │  ├─ fields.py
│  │     │  │  ├─ generics.py
│  │     │  │  ├─ json.py
│  │     │  │  ├─ main.py
│  │     │  │  ├─ mypy.py
│  │     │  │  ├─ networks.py
│  │     │  │  ├─ parse.py
│  │     │  │  ├─ py.typed
│  │     │  │  ├─ schema.py
│  │     │  │  ├─ tools.py
│  │     │  │  ├─ types.py
│  │     │  │  ├─ typing.py
│  │     │  │  ├─ utils.py
│  │     │  │  ├─ validators.py
│  │     │  │  ├─ version.py
│  │     │  │  ├─ _hypothesis_plugin.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ validate_call_decorator.py
│  │     │  ├─ validators.py
│  │     │  ├─ version.py
│  │     │  ├─ warnings.py
│  │     │  ├─ _internal
│  │     │  │  ├─ _config.py
│  │     │  │  ├─ _core_metadata.py
│  │     │  │  ├─ _core_utils.py
│  │     │  │  ├─ _dataclasses.py
│  │     │  │  ├─ _decorators.py
│  │     │  │  ├─ _decorators_v1.py
│  │     │  │  ├─ _discriminated_union.py
│  │     │  │  ├─ _docs_extraction.py
│  │     │  │  ├─ _fields.py
│  │     │  │  ├─ _forward_ref.py
│  │     │  │  ├─ _generate_schema.py
│  │     │  │  ├─ _generics.py
│  │     │  │  ├─ _git.py
│  │     │  │  ├─ _import_utils.py
│  │     │  │  ├─ _internal_dataclass.py
│  │     │  │  ├─ _known_annotated_metadata.py
│  │     │  │  ├─ _mock_val_ser.py
│  │     │  │  ├─ _model_construction.py
│  │     │  │  ├─ _namespace_utils.py
│  │     │  │  ├─ _repr.py
│  │     │  │  ├─ _schema_gather.py
│  │     │  │  ├─ _schema_generation_shared.py
│  │     │  │  ├─ _serializers.py
│  │     │  │  ├─ _signature.py
│  │     │  │  ├─ _typing_extra.py
│  │     │  │  ├─ _utils.py
│  │     │  │  ├─ _validate_call.py
│  │     │  │  ├─ _validators.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _migration.py
│  │     │  └─ __init__.py
│  │     ├─ pydantic-2.13.5.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  └─ WHEEL
│  │     ├─ pydantic_core
│  │     │  ├─ core_schema.py
│  │     │  ├─ py.typed
│  │     │  ├─ _pydantic_core.cp314-win_amd64.pyd
│  │     │  ├─ _pydantic_core.pyi
│  │     │  └─ __init__.py
│  │     ├─ pydantic_core-2.46.5.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ sboms
│  │     │  │  └─ pydantic-core.cyclonedx.json
│  │     │  └─ WHEEL
│  │     ├─ python_dateutil-2.9.0.post0.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ top_level.txt
│  │     │  ├─ WHEEL
│  │     │  └─ zip-safe
│  │     ├─ python_dotenv-1.2.4.dist-info
│  │     │  ├─ entry_points.txt
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ REQUESTED
│  │     │  ├─ top_level.txt
│  │     │  └─ WHEEL
│  │     ├─ six-1.17.0.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ top_level.txt
│  │     │  └─ WHEEL
│  │     ├─ six.py
│  │     ├─ sniffio
│  │     │  ├─ py.typed
│  │     │  ├─ _impl.py
│  │     │  ├─ _tests
│  │     │  │  ├─ test_sniffio.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ _version.py
│  │     │  └─ __init__.py
│  │     ├─ sniffio-1.3.1.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ LICENSE
│  │     │  ├─ LICENSE.APACHE2
│  │     │  ├─ LICENSE.MIT
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ top_level.txt
│  │     │  └─ WHEEL
│  │     ├─ starlette
│  │     │  ├─ applications.py
│  │     │  ├─ authentication.py
│  │     │  ├─ background.py
│  │     │  ├─ concurrency.py
│  │     │  ├─ config.py
│  │     │  ├─ convertors.py
│  │     │  ├─ datastructures.py
│  │     │  ├─ endpoints.py
│  │     │  ├─ exceptions.py
│  │     │  ├─ formparsers.py
│  │     │  ├─ middleware
│  │     │  │  ├─ authentication.py
│  │     │  │  ├─ base.py
│  │     │  │  ├─ body_limit.py
│  │     │  │  ├─ cors.py
│  │     │  │  ├─ errors.py
│  │     │  │  ├─ exceptions.py
│  │     │  │  ├─ gzip.py
│  │     │  │  ├─ httpsredirect.py
│  │     │  │  ├─ opentelemetry.py
│  │     │  │  ├─ sessions.py
│  │     │  │  ├─ trustedhost.py
│  │     │  │  ├─ wsgi.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ py.typed
│  │     │  ├─ requests.py
│  │     │  ├─ responses.py
│  │     │  ├─ routing.py
│  │     │  ├─ schemas.py
│  │     │  ├─ staticfiles.py
│  │     │  ├─ status.py
│  │     │  ├─ templating.py
│  │     │  ├─ testclient.py
│  │     │  ├─ types.py
│  │     │  ├─ websockets.py
│  │     │  ├─ _exception_handler.py
│  │     │  ├─ _utils.py
│  │     │  └─ __init__.py
│  │     ├─ starlette-1.7.0.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE.md
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  └─ WHEEL
│  │     ├─ truststore
│  │     │  ├─ py.typed
│  │     │  ├─ _api.py
│  │     │  ├─ _macos.py
│  │     │  ├─ _openssl.py
│  │     │  ├─ _ssl_constants.py
│  │     │  ├─ _windows.py
│  │     │  └─ __init__.py
│  │     ├─ truststore-0.10.4.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  └─ WHEEL
│  │     ├─ typing_extensions-4.16.0.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  └─ WHEEL
│  │     ├─ typing_extensions.py
│  │     ├─ typing_inspection
│  │     │  ├─ introspection.py
│  │     │  ├─ py.typed
│  │     │  ├─ typing_objects.py
│  │     │  ├─ typing_objects.pyi
│  │     │  └─ __init__.py
│  │     ├─ typing_inspection-0.4.4.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  └─ WHEEL
│  │     ├─ tzdata
│  │     │  ├─ zoneinfo
│  │     │  │  ├─ Africa
│  │     │  │  │  ├─ Abidjan
│  │     │  │  │  ├─ Accra
│  │     │  │  │  ├─ Addis_Ababa
│  │     │  │  │  ├─ Algiers
│  │     │  │  │  ├─ Asmara
│  │     │  │  │  ├─ Asmera
│  │     │  │  │  ├─ Bamako
│  │     │  │  │  ├─ Bangui
│  │     │  │  │  ├─ Banjul
│  │     │  │  │  ├─ Bissau
│  │     │  │  │  ├─ Blantyre
│  │     │  │  │  ├─ Brazzaville
│  │     │  │  │  ├─ Bujumbura
│  │     │  │  │  ├─ Cairo
│  │     │  │  │  ├─ Casablanca
│  │     │  │  │  ├─ Ceuta
│  │     │  │  │  ├─ Conakry
│  │     │  │  │  ├─ Dakar
│  │     │  │  │  ├─ Dar_es_Salaam
│  │     │  │  │  ├─ Djibouti
│  │     │  │  │  ├─ Douala
│  │     │  │  │  ├─ El_Aaiun
│  │     │  │  │  ├─ Freetown
│  │     │  │  │  ├─ Gaborone
│  │     │  │  │  ├─ Harare
│  │     │  │  │  ├─ Johannesburg
│  │     │  │  │  ├─ Juba
│  │     │  │  │  ├─ Kampala
│  │     │  │  │  ├─ Khartoum
│  │     │  │  │  ├─ Kigali
│  │     │  │  │  ├─ Kinshasa
│  │     │  │  │  ├─ Lagos
│  │     │  │  │  ├─ Libreville
│  │     │  │  │  ├─ Lome
│  │     │  │  │  ├─ Luanda
│  │     │  │  │  ├─ Lubumbashi
│  │     │  │  │  ├─ Lusaka
│  │     │  │  │  ├─ Malabo
│  │     │  │  │  ├─ Maputo
│  │     │  │  │  ├─ Maseru
│  │     │  │  │  ├─ Mbabane
│  │     │  │  │  ├─ Mogadishu
│  │     │  │  │  ├─ Monrovia
│  │     │  │  │  ├─ Nairobi
│  │     │  │  │  ├─ Ndjamena
│  │     │  │  │  ├─ Niamey
│  │     │  │  │  ├─ Nouakchott
│  │     │  │  │  ├─ Ouagadougou
│  │     │  │  │  ├─ Porto-Novo
│  │     │  │  │  ├─ Sao_Tome
│  │     │  │  │  ├─ Timbuktu
│  │     │  │  │  ├─ Tripoli
│  │     │  │  │  ├─ Tunis
│  │     │  │  │  ├─ Windhoek
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ America
│  │     │  │  │  ├─ Adak
│  │     │  │  │  ├─ Anchorage
│  │     │  │  │  ├─ Anguilla
│  │     │  │  │  ├─ Antigua
│  │     │  │  │  ├─ Araguaina
│  │     │  │  │  ├─ Argentina
│  │     │  │  │  │  ├─ Buenos_Aires
│  │     │  │  │  │  ├─ Catamarca
│  │     │  │  │  │  ├─ ComodRivadavia
│  │     │  │  │  │  ├─ Cordoba
│  │     │  │  │  │  ├─ Jujuy
│  │     │  │  │  │  ├─ La_Rioja
│  │     │  │  │  │  ├─ Mendoza
│  │     │  │  │  │  ├─ Rio_Gallegos
│  │     │  │  │  │  ├─ Salta
│  │     │  │  │  │  ├─ San_Juan
│  │     │  │  │  │  ├─ San_Luis
│  │     │  │  │  │  ├─ Tucuman
│  │     │  │  │  │  ├─ Ushuaia
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ Aruba
│  │     │  │  │  ├─ Asuncion
│  │     │  │  │  ├─ Atikokan
│  │     │  │  │  ├─ Atka
│  │     │  │  │  ├─ Bahia
│  │     │  │  │  ├─ Bahia_Banderas
│  │     │  │  │  ├─ Barbados
│  │     │  │  │  ├─ Belem
│  │     │  │  │  ├─ Belize
│  │     │  │  │  ├─ Blanc-Sablon
│  │     │  │  │  ├─ Boa_Vista
│  │     │  │  │  ├─ Bogota
│  │     │  │  │  ├─ Boise
│  │     │  │  │  ├─ Buenos_Aires
│  │     │  │  │  ├─ Cambridge_Bay
│  │     │  │  │  ├─ Campo_Grande
│  │     │  │  │  ├─ Cancun
│  │     │  │  │  ├─ Caracas
│  │     │  │  │  ├─ Catamarca
│  │     │  │  │  ├─ Cayenne
│  │     │  │  │  ├─ Cayman
│  │     │  │  │  ├─ Chicago
│  │     │  │  │  ├─ Chihuahua
│  │     │  │  │  ├─ Ciudad_Juarez
│  │     │  │  │  ├─ Coral_Harbour
│  │     │  │  │  ├─ Cordoba
│  │     │  │  │  ├─ Costa_Rica
│  │     │  │  │  ├─ Coyhaique
│  │     │  │  │  ├─ Creston
│  │     │  │  │  ├─ Cuiaba
│  │     │  │  │  ├─ Curacao
│  │     │  │  │  ├─ Danmarkshavn
│  │     │  │  │  ├─ Dawson
│  │     │  │  │  ├─ Dawson_Creek
│  │     │  │  │  ├─ Denver
│  │     │  │  │  ├─ Detroit
│  │     │  │  │  ├─ Dominica
│  │     │  │  │  ├─ Edmonton
│  │     │  │  │  ├─ Eirunepe
│  │     │  │  │  ├─ El_Salvador
│  │     │  │  │  ├─ Ensenada
│  │     │  │  │  ├─ Fortaleza
│  │     │  │  │  ├─ Fort_Nelson
│  │     │  │  │  ├─ Fort_Wayne
│  │     │  │  │  ├─ Glace_Bay
│  │     │  │  │  ├─ Godthab
│  │     │  │  │  ├─ Goose_Bay
│  │     │  │  │  ├─ Grand_Turk
│  │     │  │  │  ├─ Grenada
│  │     │  │  │  ├─ Guadeloupe
│  │     │  │  │  ├─ Guatemala
│  │     │  │  │  ├─ Guayaquil
│  │     │  │  │  ├─ Guyana
│  │     │  │  │  ├─ Halifax
│  │     │  │  │  ├─ Havana
│  │     │  │  │  ├─ Hermosillo
│  │     │  │  │  ├─ Indiana
│  │     │  │  │  │  ├─ Indianapolis
│  │     │  │  │  │  ├─ Knox
│  │     │  │  │  │  ├─ Marengo
│  │     │  │  │  │  ├─ Petersburg
│  │     │  │  │  │  ├─ Tell_City
│  │     │  │  │  │  ├─ Vevay
│  │     │  │  │  │  ├─ Vincennes
│  │     │  │  │  │  ├─ Winamac
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ Indianapolis
│  │     │  │  │  ├─ Inuvik
│  │     │  │  │  ├─ Iqaluit
│  │     │  │  │  ├─ Jamaica
│  │     │  │  │  ├─ Jujuy
│  │     │  │  │  ├─ Juneau
│  │     │  │  │  ├─ Kentucky
│  │     │  │  │  │  ├─ Louisville
│  │     │  │  │  │  ├─ Monticello
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ Knox_IN
│  │     │  │  │  ├─ Kralendijk
│  │     │  │  │  ├─ La_Paz
│  │     │  │  │  ├─ Lima
│  │     │  │  │  ├─ Los_Angeles
│  │     │  │  │  ├─ Louisville
│  │     │  │  │  ├─ Lower_Princes
│  │     │  │  │  ├─ Maceio
│  │     │  │  │  ├─ Managua
│  │     │  │  │  ├─ Manaus
│  │     │  │  │  ├─ Marigot
│  │     │  │  │  ├─ Martinique
│  │     │  │  │  ├─ Matamoros
│  │     │  │  │  ├─ Mazatlan
│  │     │  │  │  ├─ Mendoza
│  │     │  │  │  ├─ Menominee
│  │     │  │  │  ├─ Merida
│  │     │  │  │  ├─ Metlakatla
│  │     │  │  │  ├─ Mexico_City
│  │     │  │  │  ├─ Miquelon
│  │     │  │  │  ├─ Moncton
│  │     │  │  │  ├─ Monterrey
│  │     │  │  │  ├─ Montevideo
│  │     │  │  │  ├─ Montreal
│  │     │  │  │  ├─ Montserrat
│  │     │  │  │  ├─ Nassau
│  │     │  │  │  ├─ New_York
│  │     │  │  │  ├─ Nipigon
│  │     │  │  │  ├─ Nome
│  │     │  │  │  ├─ Noronha
│  │     │  │  │  ├─ North_Dakota
│  │     │  │  │  │  ├─ Beulah
│  │     │  │  │  │  ├─ Center
│  │     │  │  │  │  ├─ New_Salem
│  │     │  │  │  │  └─ __init__.py
│  │     │  │  │  ├─ Nuuk
│  │     │  │  │  ├─ Ojinaga
│  │     │  │  │  ├─ Panama
│  │     │  │  │  ├─ Pangnirtung
│  │     │  │  │  ├─ Paramaribo
│  │     │  │  │  ├─ Phoenix
│  │     │  │  │  ├─ Port-au-Prince
│  │     │  │  │  ├─ Porto_Acre
│  │     │  │  │  ├─ Porto_Velho
│  │     │  │  │  ├─ Port_of_Spain
│  │     │  │  │  ├─ Puerto_Rico
│  │     │  │  │  ├─ Punta_Arenas
│  │     │  │  │  ├─ Rainy_River
│  │     │  │  │  ├─ Rankin_Inlet
│  │     │  │  │  ├─ Recife
│  │     │  │  │  ├─ Regina
│  │     │  │  │  ├─ Resolute
│  │     │  │  │  ├─ Rio_Branco
│  │     │  │  │  ├─ Rosario
│  │     │  │  │  ├─ Santarem
│  │     │  │  │  ├─ Santa_Isabel
│  │     │  │  │  ├─ Santiago
│  │     │  │  │  ├─ Santo_Domingo
│  │     │  │  │  ├─ Sao_Paulo
│  │     │  │  │  ├─ Scoresbysund
│  │     │  │  │  ├─ Shiprock
│  │     │  │  │  ├─ Sitka
│  │     │  │  │  ├─ St_Barthelemy
│  │     │  │  │  ├─ St_Johns
│  │     │  │  │  ├─ St_Kitts
│  │     │  │  │  ├─ St_Lucia
│  │     │  │  │  ├─ St_Thomas
│  │     │  │  │  ├─ St_Vincent
│  │     │  │  │  ├─ Swift_Current
│  │     │  │  │  ├─ Tegucigalpa
│  │     │  │  │  ├─ Thule
│  │     │  │  │  ├─ Thunder_Bay
│  │     │  │  │  ├─ Tijuana
│  │     │  │  │  ├─ Toronto
│  │     │  │  │  ├─ Tortola
│  │     │  │  │  ├─ Vancouver
│  │     │  │  │  ├─ Virgin
│  │     │  │  │  ├─ Whitehorse
│  │     │  │  │  ├─ Winnipeg
│  │     │  │  │  ├─ Yakutat
│  │     │  │  │  ├─ Yellowknife
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ Antarctica
│  │     │  │  │  ├─ Casey
│  │     │  │  │  ├─ Davis
│  │     │  │  │  ├─ DumontDUrville
│  │     │  │  │  ├─ Macquarie
│  │     │  │  │  ├─ Mawson
│  │     │  │  │  ├─ McMurdo
│  │     │  │  │  ├─ Palmer
│  │     │  │  │  ├─ Rothera
│  │     │  │  │  ├─ South_Pole
│  │     │  │  │  ├─ Syowa
│  │     │  │  │  ├─ Troll
│  │     │  │  │  ├─ Vostok
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ Arctic
│  │     │  │  │  ├─ Longyearbyen
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ Asia
│  │     │  │  │  ├─ Aden
│  │     │  │  │  ├─ Almaty
│  │     │  │  │  ├─ Amman
│  │     │  │  │  ├─ Anadyr
│  │     │  │  │  ├─ Aqtau
│  │     │  │  │  ├─ Aqtobe
│  │     │  │  │  ├─ Ashgabat
│  │     │  │  │  ├─ Ashkhabad
│  │     │  │  │  ├─ Atyrau
│  │     │  │  │  ├─ Baghdad
│  │     │  │  │  ├─ Bahrain
│  │     │  │  │  ├─ Baku
│  │     │  │  │  ├─ Bangkok
│  │     │  │  │  ├─ Barnaul
│  │     │  │  │  ├─ Beirut
│  │     │  │  │  ├─ Bishkek
│  │     │  │  │  ├─ Brunei
│  │     │  │  │  ├─ Calcutta
│  │     │  │  │  ├─ Chita
│  │     │  │  │  ├─ Choibalsan
│  │     │  │  │  ├─ Chongqing
│  │     │  │  │  ├─ Chungking
│  │     │  │  │  ├─ Colombo
│  │     │  │  │  ├─ Dacca
│  │     │  │  │  ├─ Damascus
│  │     │  │  │  ├─ Dhaka
│  │     │  │  │  ├─ Dili
│  │     │  │  │  ├─ Dubai
│  │     │  │  │  ├─ Dushanbe
│  │     │  │  │  ├─ Famagusta
│  │     │  │  │  ├─ Gaza
│  │     │  │  │  ├─ Harbin
│  │     │  │  │  ├─ Hebron
│  │     │  │  │  ├─ Hong_Kong
│  │     │  │  │  ├─ Hovd
│  │     │  │  │  ├─ Ho_Chi_Minh
│  │     │  │  │  ├─ Irkutsk
│  │     │  │  │  ├─ Istanbul
│  │     │  │  │  ├─ Jakarta
│  │     │  │  │  ├─ Jayapura
│  │     │  │  │  ├─ Jerusalem
│  │     │  │  │  ├─ Kabul
│  │     │  │  │  ├─ Kamchatka
│  │     │  │  │  ├─ Karachi
│  │     │  │  │  ├─ Kashgar
│  │     │  │  │  ├─ Kathmandu
│  │     │  │  │  ├─ Katmandu
│  │     │  │  │  ├─ Khandyga
│  │     │  │  │  ├─ Kolkata
│  │     │  │  │  ├─ Krasnoyarsk
│  │     │  │  │  ├─ Kuala_Lumpur
│  │     │  │  │  ├─ Kuching
│  │     │  │  │  ├─ Kuwait
│  │     │  │  │  ├─ Macao
│  │     │  │  │  ├─ Macau
│  │     │  │  │  ├─ Magadan
│  │     │  │  │  ├─ Makassar
│  │     │  │  │  ├─ Manila
│  │     │  │  │  ├─ Muscat
│  │     │  │  │  ├─ Nicosia
│  │     │  │  │  ├─ Novokuznetsk
│  │     │  │  │  ├─ Novosibirsk
│  │     │  │  │  ├─ Omsk
│  │     │  │  │  ├─ Oral
│  │     │  │  │  ├─ Phnom_Penh
│  │     │  │  │  ├─ Pontianak
│  │     │  │  │  ├─ Pyongyang
│  │     │  │  │  ├─ Qatar
│  │     │  │  │  ├─ Qostanay
│  │     │  │  │  ├─ Qyzylorda
│  │     │  │  │  ├─ Rangoon
│  │     │  │  │  ├─ Riyadh
│  │     │  │  │  ├─ Saigon
│  │     │  │  │  ├─ Sakhalin
│  │     │  │  │  ├─ Samarkand
│  │     │  │  │  ├─ Seoul
│  │     │  │  │  ├─ Shanghai
│  │     │  │  │  ├─ Singapore
│  │     │  │  │  ├─ Srednekolymsk
│  │     │  │  │  ├─ Taipei
│  │     │  │  │  ├─ Tashkent
│  │     │  │  │  ├─ Tbilisi
│  │     │  │  │  ├─ Tehran
│  │     │  │  │  ├─ Tel_Aviv
│  │     │  │  │  ├─ Thimbu
│  │     │  │  │  ├─ Thimphu
│  │     │  │  │  ├─ Tokyo
│  │     │  │  │  ├─ Tomsk
│  │     │  │  │  ├─ Ujung_Pandang
│  │     │  │  │  ├─ Ulaanbaatar
│  │     │  │  │  ├─ Ulan_Bator
│  │     │  │  │  ├─ Urumqi
│  │     │  │  │  ├─ Ust-Nera
│  │     │  │  │  ├─ Vientiane
│  │     │  │  │  ├─ Vladivostok
│  │     │  │  │  ├─ Yakutsk
│  │     │  │  │  ├─ Yangon
│  │     │  │  │  ├─ Yekaterinburg
│  │     │  │  │  ├─ Yerevan
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ Atlantic
│  │     │  │  │  ├─ Azores
│  │     │  │  │  ├─ Bermuda
│  │     │  │  │  ├─ Canary
│  │     │  │  │  ├─ Cape_Verde
│  │     │  │  │  ├─ Faeroe
│  │     │  │  │  ├─ Faroe
│  │     │  │  │  ├─ Jan_Mayen
│  │     │  │  │  ├─ Madeira
│  │     │  │  │  ├─ Reykjavik
│  │     │  │  │  ├─ South_Georgia
│  │     │  │  │  ├─ Stanley
│  │     │  │  │  ├─ St_Helena
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ Australia
│  │     │  │  │  ├─ ACT
│  │     │  │  │  ├─ Adelaide
│  │     │  │  │  ├─ Brisbane
│  │     │  │  │  ├─ Broken_Hill
│  │     │  │  │  ├─ Canberra
│  │     │  │  │  ├─ Currie
│  │     │  │  │  ├─ Darwin
│  │     │  │  │  ├─ Eucla
│  │     │  │  │  ├─ Hobart
│  │     │  │  │  ├─ LHI
│  │     │  │  │  ├─ Lindeman
│  │     │  │  │  ├─ Lord_Howe
│  │     │  │  │  ├─ Melbourne
│  │     │  │  │  ├─ North
│  │     │  │  │  ├─ NSW
│  │     │  │  │  ├─ Perth
│  │     │  │  │  ├─ Queensland
│  │     │  │  │  ├─ South
│  │     │  │  │  ├─ Sydney
│  │     │  │  │  ├─ Tasmania
│  │     │  │  │  ├─ Victoria
│  │     │  │  │  ├─ West
│  │     │  │  │  ├─ Yancowinna
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ Brazil
│  │     │  │  │  ├─ Acre
│  │     │  │  │  ├─ DeNoronha
│  │     │  │  │  ├─ East
│  │     │  │  │  ├─ West
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ Canada
│  │     │  │  │  ├─ Atlantic
│  │     │  │  │  ├─ Central
│  │     │  │  │  ├─ Eastern
│  │     │  │  │  ├─ Mountain
│  │     │  │  │  ├─ Newfoundland
│  │     │  │  │  ├─ Pacific
│  │     │  │  │  ├─ Saskatchewan
│  │     │  │  │  ├─ Yukon
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ CET
│  │     │  │  ├─ Chile
│  │     │  │  │  ├─ Continental
│  │     │  │  │  ├─ EasterIsland
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ CST6CDT
│  │     │  │  ├─ Cuba
│  │     │  │  ├─ EET
│  │     │  │  ├─ Egypt
│  │     │  │  ├─ Eire
│  │     │  │  ├─ EST
│  │     │  │  ├─ EST5EDT
│  │     │  │  ├─ Etc
│  │     │  │  │  ├─ GMT
│  │     │  │  │  ├─ GMT+0
│  │     │  │  │  ├─ GMT+1
│  │     │  │  │  ├─ GMT+10
│  │     │  │  │  ├─ GMT+11
│  │     │  │  │  ├─ GMT+12
│  │     │  │  │  ├─ GMT+2
│  │     │  │  │  ├─ GMT+3
│  │     │  │  │  ├─ GMT+4
│  │     │  │  │  ├─ GMT+5
│  │     │  │  │  ├─ GMT+6
│  │     │  │  │  ├─ GMT+7
│  │     │  │  │  ├─ GMT+8
│  │     │  │  │  ├─ GMT+9
│  │     │  │  │  ├─ GMT-0
│  │     │  │  │  ├─ GMT-1
│  │     │  │  │  ├─ GMT-10
│  │     │  │  │  ├─ GMT-11
│  │     │  │  │  ├─ GMT-12
│  │     │  │  │  ├─ GMT-13
│  │     │  │  │  ├─ GMT-14
│  │     │  │  │  ├─ GMT-2
│  │     │  │  │  ├─ GMT-3
│  │     │  │  │  ├─ GMT-4
│  │     │  │  │  ├─ GMT-5
│  │     │  │  │  ├─ GMT-6
│  │     │  │  │  ├─ GMT-7
│  │     │  │  │  ├─ GMT-8
│  │     │  │  │  ├─ GMT-9
│  │     │  │  │  ├─ GMT0
│  │     │  │  │  ├─ Greenwich
│  │     │  │  │  ├─ UCT
│  │     │  │  │  ├─ Universal
│  │     │  │  │  ├─ UTC
│  │     │  │  │  ├─ Zulu
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ Europe
│  │     │  │  │  ├─ Amsterdam
│  │     │  │  │  ├─ Andorra
│  │     │  │  │  ├─ Astrakhan
│  │     │  │  │  ├─ Athens
│  │     │  │  │  ├─ Belfast
│  │     │  │  │  ├─ Belgrade
│  │     │  │  │  ├─ Berlin
│  │     │  │  │  ├─ Bratislava
│  │     │  │  │  ├─ Brussels
│  │     │  │  │  ├─ Bucharest
│  │     │  │  │  ├─ Budapest
│  │     │  │  │  ├─ Busingen
│  │     │  │  │  ├─ Chisinau
│  │     │  │  │  ├─ Copenhagen
│  │     │  │  │  ├─ Dublin
│  │     │  │  │  ├─ Gibraltar
│  │     │  │  │  ├─ Guernsey
│  │     │  │  │  ├─ Helsinki
│  │     │  │  │  ├─ Isle_of_Man
│  │     │  │  │  ├─ Istanbul
│  │     │  │  │  ├─ Jersey
│  │     │  │  │  ├─ Kaliningrad
│  │     │  │  │  ├─ Kiev
│  │     │  │  │  ├─ Kirov
│  │     │  │  │  ├─ Kyiv
│  │     │  │  │  ├─ Lisbon
│  │     │  │  │  ├─ Ljubljana
│  │     │  │  │  ├─ London
│  │     │  │  │  ├─ Luxembourg
│  │     │  │  │  ├─ Madrid
│  │     │  │  │  ├─ Malta
│  │     │  │  │  ├─ Mariehamn
│  │     │  │  │  ├─ Minsk
│  │     │  │  │  ├─ Monaco
│  │     │  │  │  ├─ Moscow
│  │     │  │  │  ├─ Nicosia
│  │     │  │  │  ├─ Oslo
│  │     │  │  │  ├─ Paris
│  │     │  │  │  ├─ Podgorica
│  │     │  │  │  ├─ Prague
│  │     │  │  │  ├─ Riga
│  │     │  │  │  ├─ Rome
│  │     │  │  │  ├─ Samara
│  │     │  │  │  ├─ San_Marino
│  │     │  │  │  ├─ Sarajevo
│  │     │  │  │  ├─ Saratov
│  │     │  │  │  ├─ Simferopol
│  │     │  │  │  ├─ Skopje
│  │     │  │  │  ├─ Sofia
│  │     │  │  │  ├─ Stockholm
│  │     │  │  │  ├─ Tallinn
│  │     │  │  │  ├─ Tirane
│  │     │  │  │  ├─ Tiraspol
│  │     │  │  │  ├─ Ulyanovsk
│  │     │  │  │  ├─ Uzhgorod
│  │     │  │  │  ├─ Vaduz
│  │     │  │  │  ├─ Vatican
│  │     │  │  │  ├─ Vienna
│  │     │  │  │  ├─ Vilnius
│  │     │  │  │  ├─ Volgograd
│  │     │  │  │  ├─ Warsaw
│  │     │  │  │  ├─ Zagreb
│  │     │  │  │  ├─ Zaporozhye
│  │     │  │  │  ├─ Zurich
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ Factory
│  │     │  │  ├─ GB
│  │     │  │  ├─ GB-Eire
│  │     │  │  ├─ GMT
│  │     │  │  ├─ GMT+0
│  │     │  │  ├─ GMT-0
│  │     │  │  ├─ GMT0
│  │     │  │  ├─ Greenwich
│  │     │  │  ├─ Hongkong
│  │     │  │  ├─ HST
│  │     │  │  ├─ Iceland
│  │     │  │  ├─ Indian
│  │     │  │  │  ├─ Antananarivo
│  │     │  │  │  ├─ Chagos
│  │     │  │  │  ├─ Christmas
│  │     │  │  │  ├─ Cocos
│  │     │  │  │  ├─ Comoro
│  │     │  │  │  ├─ Kerguelen
│  │     │  │  │  ├─ Mahe
│  │     │  │  │  ├─ Maldives
│  │     │  │  │  ├─ Mauritius
│  │     │  │  │  ├─ Mayotte
│  │     │  │  │  ├─ Reunion
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ Iran
│  │     │  │  ├─ iso3166.tab
│  │     │  │  ├─ Israel
│  │     │  │  ├─ Jamaica
│  │     │  │  ├─ Japan
│  │     │  │  ├─ Kwajalein
│  │     │  │  ├─ leapseconds
│  │     │  │  ├─ Libya
│  │     │  │  ├─ MET
│  │     │  │  ├─ Mexico
│  │     │  │  │  ├─ BajaNorte
│  │     │  │  │  ├─ BajaSur
│  │     │  │  │  ├─ General
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ MST
│  │     │  │  ├─ MST7MDT
│  │     │  │  ├─ Navajo
│  │     │  │  ├─ NZ
│  │     │  │  ├─ NZ-CHAT
│  │     │  │  ├─ Pacific
│  │     │  │  │  ├─ Apia
│  │     │  │  │  ├─ Auckland
│  │     │  │  │  ├─ Bougainville
│  │     │  │  │  ├─ Chatham
│  │     │  │  │  ├─ Chuuk
│  │     │  │  │  ├─ Easter
│  │     │  │  │  ├─ Efate
│  │     │  │  │  ├─ Enderbury
│  │     │  │  │  ├─ Fakaofo
│  │     │  │  │  ├─ Fiji
│  │     │  │  │  ├─ Funafuti
│  │     │  │  │  ├─ Galapagos
│  │     │  │  │  ├─ Gambier
│  │     │  │  │  ├─ Guadalcanal
│  │     │  │  │  ├─ Guam
│  │     │  │  │  ├─ Honolulu
│  │     │  │  │  ├─ Johnston
│  │     │  │  │  ├─ Kanton
│  │     │  │  │  ├─ Kiritimati
│  │     │  │  │  ├─ Kosrae
│  │     │  │  │  ├─ Kwajalein
│  │     │  │  │  ├─ Majuro
│  │     │  │  │  ├─ Marquesas
│  │     │  │  │  ├─ Midway
│  │     │  │  │  ├─ Nauru
│  │     │  │  │  ├─ Niue
│  │     │  │  │  ├─ Norfolk
│  │     │  │  │  ├─ Noumea
│  │     │  │  │  ├─ Pago_Pago
│  │     │  │  │  ├─ Palau
│  │     │  │  │  ├─ Pitcairn
│  │     │  │  │  ├─ Pohnpei
│  │     │  │  │  ├─ Ponape
│  │     │  │  │  ├─ Port_Moresby
│  │     │  │  │  ├─ Rarotonga
│  │     │  │  │  ├─ Saipan
│  │     │  │  │  ├─ Samoa
│  │     │  │  │  ├─ Tahiti
│  │     │  │  │  ├─ Tarawa
│  │     │  │  │  ├─ Tongatapu
│  │     │  │  │  ├─ Truk
│  │     │  │  │  ├─ Wake
│  │     │  │  │  ├─ Wallis
│  │     │  │  │  ├─ Yap
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ Poland
│  │     │  │  ├─ Portugal
│  │     │  │  ├─ PRC
│  │     │  │  ├─ PST8PDT
│  │     │  │  ├─ ROC
│  │     │  │  ├─ ROK
│  │     │  │  ├─ Singapore
│  │     │  │  ├─ Turkey
│  │     │  │  ├─ tzdata.zi
│  │     │  │  ├─ UCT
│  │     │  │  ├─ Universal
│  │     │  │  ├─ US
│  │     │  │  │  ├─ Alaska
│  │     │  │  │  ├─ Aleutian
│  │     │  │  │  ├─ Arizona
│  │     │  │  │  ├─ Central
│  │     │  │  │  ├─ East-Indiana
│  │     │  │  │  ├─ Eastern
│  │     │  │  │  ├─ Hawaii
│  │     │  │  │  ├─ Indiana-Starke
│  │     │  │  │  ├─ Michigan
│  │     │  │  │  ├─ Mountain
│  │     │  │  │  ├─ Pacific
│  │     │  │  │  ├─ Samoa
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ UTC
│  │     │  │  ├─ W-SU
│  │     │  │  ├─ WET
│  │     │  │  ├─ zone.tab
│  │     │  │  ├─ zone1970.tab
│  │     │  │  ├─ zonenow.tab
│  │     │  │  ├─ Zulu
│  │     │  │  └─ __init__.py
│  │     │  ├─ zones
│  │     │  └─ __init__.py
│  │     ├─ tzdata-2026.5.dist-info
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  ├─ LICENSE
│  │     │  │  └─ licenses
│  │     │  │     └─ LICENSE_APACHE
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ top_level.txt
│  │     │  └─ WHEEL
│  │     ├─ uvicorn
│  │     │  ├─ config.py
│  │     │  ├─ importer.py
│  │     │  ├─ lifespan
│  │     │  │  ├─ off.py
│  │     │  │  ├─ on.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ logging.py
│  │     │  ├─ loops
│  │     │  │  ├─ asyncio.py
│  │     │  │  ├─ auto.py
│  │     │  │  ├─ uvloop.py
│  │     │  │  ├─ zuvloop.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ main.py
│  │     │  ├─ middleware
│  │     │  │  ├─ asgi2.py
│  │     │  │  ├─ message_logger.py
│  │     │  │  ├─ proxy_headers.py
│  │     │  │  ├─ wsgi.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ protocols
│  │     │  │  ├─ http
│  │     │  │  │  ├─ auto.py
│  │     │  │  │  ├─ auto_zttp_impl.py
│  │     │  │  │  ├─ flow_control.py
│  │     │  │  │  ├─ h11_impl.py
│  │     │  │  │  ├─ httptools_impl.py
│  │     │  │  │  ├─ zttp_h2_impl.py
│  │     │  │  │  ├─ zttp_impl.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  ├─ utils.py
│  │     │  │  ├─ websockets
│  │     │  │  │  ├─ auto.py
│  │     │  │  │  ├─ websockets_impl.py
│  │     │  │  │  ├─ websockets_sansio_impl.py
│  │     │  │  │  ├─ wsproto_impl.py
│  │     │  │  │  └─ __init__.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ py.typed
│  │     │  ├─ server.py
│  │     │  ├─ supervisors
│  │     │  │  ├─ basereload.py
│  │     │  │  ├─ multiprocess.py
│  │     │  │  ├─ statreload.py
│  │     │  │  ├─ watchfilesreload.py
│  │     │  │  └─ __init__.py
│  │     │  ├─ workers.py
│  │     │  ├─ _ansi.py
│  │     │  ├─ _compat.py
│  │     │  ├─ _subprocess.py
│  │     │  ├─ _types.py
│  │     │  ├─ __init__.py
│  │     │  └─ __main__.py
│  │     ├─ uvicorn-0.54.0.dist-info
│  │     │  ├─ entry_points.txt
│  │     │  ├─ INSTALLER
│  │     │  ├─ licenses
│  │     │  │  └─ LICENSE.md
│  │     │  ├─ METADATA
│  │     │  ├─ RECORD
│  │     │  ├─ REQUESTED
│  │     │  └─ WHEEL
│  │     └─ _cffi_backend.cp314-win_amd64.pyd
│  ├─ pyvenv.cfg
│  └─ Scripts
│     ├─ activate
│     ├─ activate.bat
│     ├─ activate.fish
│     ├─ Activate.ps1
│     ├─ cffi-gen-src.exe
│     ├─ deactivate.bat
│     ├─ dotenv.exe
│     ├─ f2py.exe
│     ├─ fastapi.exe
│     ├─ httpx2.exe
│     ├─ idna.exe
│     ├─ json_repair.exe
│     ├─ numpy-config.exe
│     ├─ pip.exe
│     ├─ pip3.14.exe
│     ├─ pip3.exe
│     ├─ python.exe
│     ├─ pythonw.exe
│     └─ uvicorn.exe
├─ ai
│  ├─ explanations
│  │  ├─ explainer.py
│  │  └─ README.md
│  ├─ forecasting
│  │  ├─ forecaster.py
│  │  └─ README.md
│  ├─ matching
│  │  ├─ matcher.py
│  │  └─ README.md
│  ├─ optimization
│  │  ├─ optimizer.py
│  │  └─ README.md
│  ├─ pipeline
│  │  ├─ .env
│  │  ├─ allocation.py
│  │  ├─ brain.py
│  │  ├─ brain_schema.py
│  │  ├─ check_nvidia.py
│  │  ├─ compare_models.py
│  │  ├─ explanation.py
│  │  ├─ impact.py
│  │  ├─ list_models.py
│  │  ├─ main.py
│  │  ├─ matching_scores.py
│  │  ├─ run_pipeline.py
│  │  └─ surplus_forecast.py
│  └─ risk
│     ├─ README.md
│     └─ risk_assessor.py
├─ backend
│  ├─ .env
│  ├─ .env.example
│  ├─ api
│  │  ├─ README.md
│  │  └─ routes.py
│  ├─ auth
│  │  ├─ auth_service.py
│  │  └─ README.md
│  ├─ crops
│  │  ├─ crop_service.py
│  │  └─ README.md
│  ├─ database
│  │  └─ legacy
│  ├─ docker-compose.yml
│  ├─ farms
│  │  ├─ farm_service.py
│  │  └─ README.md
│  ├─ impact
│  │  ├─ impact_service.py
│  │  └─ README.md
│  ├─ interventions
│  │  ├─ intervention_service.py
│  │  └─ README.md
│  ├─ logistics
│  │  ├─ logistics_service.py
│  │  └─ README.md
│  ├─ markets
│  │  ├─ market_service.py
│  │  └─ README.md
│  ├─ matching
│  │  ├─ matching_service.py
│  │  └─ README.md
│  ├─ notifications
│  │  ├─ notification_service.py
│  │  └─ README.md
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ resources
│  │  ├─ README.md
│  │  └─ resource_service.py
│  ├─ src
│  │  ├─ app.js
│  │  ├─ config.js
│  │  ├─ db
│  │  │  ├─ migrate.js
│  │  │  ├─ migrations
│  │  │  │  ├─ 001_init.sql
│  │  │  │  └─ 002_notifications_actions.sql
│  │  │  ├─ pool.js
│  │  │  └─ seed.js
│  │  ├─ middleware
│  │  │  ├─ auth.js
│  │  │  ├─ error.js
│  │  │  └─ validate.js
│  │  ├─ modules
│  │  │  ├─ auth
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  ├─ crops
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  ├─ farms
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  ├─ impact
│  │  │  │  └─ service.js
│  │  │  ├─ interventions
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  ├─ marketplace
│  │  │  │  └─ service.js
│  │  │  ├─ notifications
│  │  │  │  ├─ routes.js
│  │  │  │  └─ service.js
│  │  │  ├─ overview
│  │  │  │  ├─ routes.js
│  │  │  │  └─ service.js
│  │  │  ├─ resources
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  ├─ storage
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  ├─ transactions
│  │  │  │  ├─ routes.js
│  │  │  │  ├─ schemas.js
│  │  │  │  └─ service.js
│  │  │  └─ transport
│  │  │     ├─ routes.js
│  │  │     ├─ schemas.js
│  │  │     └─ service.js
│  │  ├─ server.js
│  │  └─ utils
│  │     └─ errors.js
│  └─ storage
│     ├─ README.md
│     └─ storage_manager.py
├─ data
│  ├─ feature_engineering
│  │  ├─ feature_engineer.py
│  │  └─ README.md
│  ├─ ingestion
│  │  ├─ ingestion_service.py
│  │  └─ README.md
│  ├─ transformation
│  │  ├─ README.md
│  │  └─ transformer.py
│  └─ validation
│     ├─ README.md
│     └─ validator.py
├─ database
│  ├─ ARCHITECTURE.md
│  ├─ ERD.md
│  ├─ migrations
│  │  ├─ 001_create_users_table.sql
│  │  ├─ 002_create_farms_table.sql
│  │  ├─ 003_create_crops_table.sql
│  │  ├─ 004_create_resources_table.sql
│  │  ├─ 005_create_interventions_table.sql
│  │  ├─ 006_create_transactions_table.sql
│  │  ├─ 007_create_transactions_workflow.sql
│  │  ├─ migrate.py
│  │  ├─ MIGRATION_GUIDE.md
│  │  └─ README.md
│  ├─ schema
│  │  ├─ README.md
│  │  └─ schema.sql
│  ├─ seeds
│  │  ├─ README.md
│  │  └─ seeder.py
│  └─ views
│     ├─ README.md
│     └─ views.sql
├─ docs
│  └─ README.md
├─ frontend
│  ├─ .env
│  ├─ .oxlintrc.json
│  ├─ admin
│  │  ├─ AdminDashboard.jsx
│  │  ├─ components
│  │  │  ├─ AlertsCard.jsx
│  │  │  ├─ ChartCards.jsx
│  │  │  ├─ FarmersTable.jsx
│  │  │  ├─ HealthCard.jsx
│  │  │  ├─ KpiGrid.jsx
│  │  │  └─ PartnersCard.jsx
│  │  ├─ data.js
│  │  └─ README.md
│  ├─ components.json
│  ├─ dashboard
│  │  ├─ components
│  │  │  ├─ ActivityCard.jsx
│  │  │  ├─ CropsCard.jsx
│  │  │  ├─ ForecastCard.jsx
│  │  │  ├─ KpiGrid.jsx
│  │  │  ├─ OpportunitiesCard.jsx
│  │  │  ├─ PricesCard.jsx
│  │  │  ├─ RecsCard.jsx
│  │  │  └─ WeatherCard.jsx
│  │  ├─ Dashboard.jsx
│  │  ├─ data.js
│  │  └─ README.md
│  ├─ dist
│  │  ├─ assets
│  │  │  ├─ AdminDashboard-DvCPiUrT.js
│  │  │  ├─ Assistant-BLoad9z5.js
│  │  │  ├─ charts-uCBCHBVD.js
│  │  │  ├─ circle-dollar-sign-BVS-PujZ.js
│  │  │  ├─ Dashboard-CkIV6Mt1.js
│  │  │  ├─ FarmerPortal-oN5WVzk4.js
│  │  │  ├─ FarmerPortal-vh-t_kPv.css
│  │  │  ├─ geist-cyrillic-ext-wght-normal-DjL33-gN.woff2
│  │  │  ├─ geist-cyrillic-wght-normal-BEAKL7Jp.woff2
│  │  │  ├─ geist-latin-ext-wght-normal-DC-KSUi6.woff2
│  │  │  ├─ geist-latin-wght-normal-BgDaEnEv.woff2
│  │  │  ├─ geist-vietnamese-wght-normal-6IgcOCM7.woff2
│  │  │  ├─ index-D8SBaWV2.js
│  │  │  ├─ index-DScx6bri.css
│  │  │  ├─ leaf-CqbqMqYH.js
│  │  │  ├─ PartnerPortal-8NdhmrFV.js
│  │  │  ├─ shield-alert-CAoHQRP6.js
│  │  │  ├─ triangle-alert-22vvhLVg.js
│  │  │  └─ utils-B3vMxh12.js
│  │  ├─ favicon.svg
│  │  ├─ icons.svg
│  │  └─ index.html
│  ├─ farmer
│  │  ├─ components
│  │  │  ├─ page-parts.jsx
│  │  │  └─ ui.jsx
│  │  ├─ constants.js
│  │  ├─ FarmerPortal.jsx
│  │  ├─ README.md
│  │  └─ views
│  │     ├─ AddFarmForm.jsx
│  │     ├─ Crops.jsx
│  │     ├─ FarmDetails.jsx
│  │     ├─ Forecast.jsx
│  │     ├─ impact
│  │     │  ├─ data.js
│  │     │  ├─ Interventions.jsx
│  │     │  ├─ Recovery.jsx
│  │     │  ├─ Reports.jsx
│  │     │  ├─ Sources.jsx
│  │     │  └─ Trend.jsx
│  │     ├─ Impact.jsx
│  │     ├─ Market.jsx
│  │     ├─ messages
│  │     │  ├─ data.js
│  │     │  └─ NotificationItem.jsx
│  │     ├─ Messages.jsx
│  │     ├─ MyFarms.jsx
│  │     ├─ Opportunities.jsx
│  │     ├─ overview
│  │     │  ├─ data.js
│  │     │  ├─ EnvImpact.jsx
│  │     │  ├─ FarmsTable.jsx
│  │     │  ├─ GridActivity.jsx
│  │     │  ├─ HarvestOutlook.jsx
│  │     │  ├─ RiskWatch.jsx
│  │     │  ├─ StatCards.jsx
│  │     │  └─ TodayRecs.jsx
│  │     ├─ Overview.jsx
│  │     ├─ Profile.jsx
│  │     ├─ Recommendations.jsx
│  │     ├─ storage
│  │     │  ├─ CapacityTimeline.jsx
│  │     │  ├─ data.js
│  │     │  ├─ FacilitiesTable.jsx
│  │     │  ├─ MapCard.jsx
│  │     │  ├─ RecommendedCard.jsx
│  │     │  └─ Reservations.jsx
│  │     ├─ Storage.jsx
│  │     ├─ transport
│  │     │  ├─ data.js
│  │     │  ├─ Deliveries.jsx
│  │     │  ├─ MapCard.jsx
│  │     │  ├─ PlanCard.jsx
│  │     │  ├─ QuickActions.jsx
│  │     │  └─ RequestsTable.jsx
│  │     └─ Transport.jsx
│  ├─ index.html
│  ├─ jsconfig.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ partner
│  │  ├─ components
│  │  │  ├─ CapacityBar.jsx
│  │  │  ├─ KpiGrid.jsx
│  │  │  ├─ ListingTab.jsx
│  │  │  ├─ OrdersTab.jsx
│  │  │  ├─ RequestsTab.jsx
│  │  │  └─ VolumeCard.jsx
│  │  ├─ data.js
│  │  ├─ PartnerPortal.jsx
│  │  ├─ README.md
│  │  └─ usePartnerStats.js
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ shared
│  │  ├─ Assistant.jsx
│  │  ├─ chartColors.js
│  │  ├─ charts.jsx
│  │  ├─ data.js
│  │  ├─ EmptyState.jsx
│  │  ├─ geo.js
│  │  ├─ MapView.jsx
│  │  ├─ nav.js
│  │  ├─ Shell.jsx
│  │  ├─ Skeleton.jsx
│  │  └─ utils.js
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  └─ ui
│  │  │     └─ button.jsx
│  │  ├─ index.css
│  │  ├─ lib
│  │  │  └─ utils.js
│  │  └─ main.jsx
│  └─ vite.config.js
├─ integrations
│  ├─ maps
│  │  ├─ maps_service.py
│  │  └─ README.md
│  ├─ markets
│  │  ├─ market_data_service.py
│  │  └─ README.md
│  ├─ notifications
│  │  ├─ notification_providers.py
│  │  └─ README.md
│  └─ weather
│     ├─ README.md
│     └─ weather_service.py
├─ LICENSE
├─ README.md
├─ src
│  └─ styles
└─ tests
   ├─ README.md
   └─ test_farm_service.py
```
