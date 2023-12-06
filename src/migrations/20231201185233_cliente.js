/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.raw(
        "CREATE TABLE `cliente` (\n" +
        "  `id_cliente` int NOT NULL AUTO_INCREMENT,\n" +
        "  `id_usuario` int NOT NULL DEFAULT '0',\n" +
        "  `nombre` varchar(30) NOT NULL,\n" +
        "  `apellido_paterno` varchar(15) NOT NULL,\n" +
        "  `apellido_materno` varchar(15) NOT NULL,\n" +
        "  `notas` text,\n" +
        "  `fotografia` varchar(500) DEFAULT NULL,\n" +
        "  `edad` int NOT NULL,\n" +
        "  `deleted` tinyint NOT NULL DEFAULT '0',\n" +
        "  `deleted_at` date DEFAULT NULL,\n" +
        "  `deleted_by` int DEFAULT NULL,\n" +
        "  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n" +
        "  `created_by` int NOT NULL DEFAULT '0',\n" +
        "  `updated_at` date DEFAULT NULL,\n" +
        "  `updated_by` varchar(45) DEFAULT NULL,\n" +
        "  PRIMARY KEY (`id_cliente`),\n" +
        "  KEY `id_user_client_idx` (`id_usuario`),\n" +
        "  KEY `id_usuario_cliente_idx` (`id_usuario`),\n" +
        "  CONSTRAINT `id_usuario_cliente` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)\n" +
        ") ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb3"
    )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.raw("DROP TABLE IF EXISTS `cliente`");
};
