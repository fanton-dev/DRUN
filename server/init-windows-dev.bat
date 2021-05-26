rem Creates simlinks in all services to the core folder
mklink /J "./services/orders-service/core" "./core"
mklink /J "./services/payment-service/core" "./core"
mklink /J "./services/delivery-service/core" "./core"
mklink /J "./services/logger-service/core" "./core"
mklink /J "./services/users-service/core" "./core"