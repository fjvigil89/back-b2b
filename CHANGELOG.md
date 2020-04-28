# Changelog

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

### Feature
- Se agregan dos nuevas funcionalidades para obtener venta valor
  por categoria, mensual y anual.