cat > ./.ebextensions/node-settings.config <<EOF
option_settings:
  aws:elasticbeanstalk:application:environment:
    AWS_CREDENTIALS_accessKeyId: $AWS_CREDENTIALS_accessKeyId
    AWS_CREDENTIALS_secretAccessKey: $AWS_CREDENTIALS_secretAccessKey
    CLIENT: $CLIENT
    ID_ESTUDIO_SUPI: $ID_ESTUDIO_SUPI
    KM: $KM
    PRODUCTION_CONFIGURATION_DB: $PRODUCTION_CONFIGURATION_DB
    PRODUCTION_CONFIGURATION_PASSWORD: $PRODUCTION_CONFIGURATION_PASSWORD
    PRODUCTION_CONFIGURATION_PORT_DB: $PRODUCTION_CONFIGURATION_PORT_DB
    PRODUCTION_CONFIGURATION_SERVER: $PRODUCTION_CONFIGURATION_SERVER
    PRODUCTION_CONFIGURATION_USER_DB: $PRODUCTION_CONFIGURATION_USER_DB
    SOURCE_B2B_DB: $SOURCE_B2B_DB
    SOURCE_MASTER_DB: $SOURCE_MASTER_DB
    SOURCE_MASTER_PASSWORD: $SOURCE_MASTER_PASSWORD
    SOURCE_MASTER_PORT_DB: $SOURCE_MASTER_PORT_DB
    SOURCE_MASTER_SERVER: $SOURCE_MASTER_SERVER
    SOURCE_MASTER_USER_DB: $SOURCE_MASTER_USER_DB
    SOURCE_PRINCIPAL_DB: $SOURCE_PRINCIPAL_DB
    SOURCE_PRINCIPAL_PASSWORD: $SOURCE_PRINCIPAL_PASSWORD
    SOURCE_PRINCIPAL_PORT_DB: $SOURCE_PRINCIPAL_PORT_DB
    SOURCE_PRINCIPAL_SERVER: $SOURCE_PRINCIPAL_SERVER
    SOURCE_PRINCIPAL_USER_DB: $SOURCE_PRINCIPAL_USER_DB
    SOURCE_SUPI_DB: $SOURCE_SUPI_DB
    SOURCE_SUPI_PASSWORD: $SOURCE_SUPI_PASSWORD
    SOURCE_SUPI_PORT_DB: $SOURCE_SUPI_PORT_DB
    SOURCE_SUPI_SERVER: $SOURCE_SUPI_SERVER
    SOURCE_SUPI_USER_DB: $SOURCE_SUPI_USER_DB
  aws:elasticbeanstalk:container:nodejs: 
    NodeCommand: "npm start"
    NodeVersion: 8.14.0
EOF