# Changelog

## [2.2.4] - 2021-10-07

## Fix

- Se modifica de donde se obtiene venta_valor en endpoint de listado de salas.

## [2.1.4] - 2021-06-09

## Fix

- Se agrega un nuevo enpoint para darle soporte a flar revisar

## [2.1.3] - 2020-10-23

## Fix

- Se agrega timeout a la conexión demo.

## [2.1.2] - 2020-10-22

### Fix

- Se corrige error en conexión a base de datos.

## [2.1.1] - 2020-10-22

### Fix

- Se mueven dependencias de desarrollo a devDependencies por error en build.

## [2.1.0] - 2020-10-22

### Added

- Se crea nuevo servicio para hotnews.
- Para este nuevo servicio se crean las rutas, controladores, schemas.
- Se crea nueva conexión para las siguientes bd andina-app y abi-app.

## [2.0.9] - 2020-10-14

### Refactor

- Se agrega el nuevo cliente DEMO para poder presentar productos a posibles clientes.

## [2.0.7] - 2020-08-25

### Added

- Se agrega date y user a poll y se actualiza query en PullRepository

## [2.0.6] - 2020-07-01

### Refactor

- Se modifica dentro del repositorio Poll (archivo PollRepository) la query
  para obtener la encuesta por usuario.

## [2.0.5] - 2020-06-24

### Feature

- Se agrega nuevo servicio para obtener los indicador por cliente.
- Para tales efector se crea nueva ruta para de metodo get '/indicador/all',
  que recibe en el body el folio.
- Se crea controlador y dentro de este la función list que invoca al servicio.

## [2.0.4] - 2020-04-28

### Feature

- Se agregan dos nuevas funcionalidades para obtener venta valor
  por categoria, mensual y anual.
- Se agregan además de las dos funcionalidades anterios, otras dos
  para la descarga de venta valor del mes y anual del año pasado.
- Se modifica la entrega de datos a objeto ordenados por su categoria
  y dentro la info obtenida por la funcionalidades anteriores.

### FIX

- Se modifica la query para eliminar el ean cero por ende categoria
  espacios vacios

## [2.0.3] - 2020-04-28

### Feature

- Se agrega venta valor.

### Added

- Se agrega conexion a base de datos de ABI.
- Se agrega VentasRouten en Router.
- Se agrega VentasController.
- Se agrega Ventas route.
- Se agrega schema Ventas
- Se agrega Ventas service.
- Se agrega getVentaValor(), getMTB(), getMTBLY(), getTarget(), getYTB(), getYTBLY() y getTargetYear() en services/external/B2B.ts
-

### Fix

- Fix para la instancia de multer.

### Refactor

- Se remueve .send en list() en StoreController
