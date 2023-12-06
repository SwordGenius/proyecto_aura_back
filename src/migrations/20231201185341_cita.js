/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.raw(
        "CREATE TABLE `cita` (\n" +
        "  `id_cita` int NOT NULL AUTO_INCREMENT,\n" +
        "  `id_cliente` int NOT NULL,\n" +
        "  `id_usuario` int NOT NULL,\n" +
        "  `motivo` varchar(30) DEFAULT NULL,\n" +
        "  `fecha_cita` date DEFAULT NULL,\n" +
        "  `deleted` tinyint NOT NULL DEFAULT '0',\n" +
        "  `deleted_at` date DEFAULT NULL,\n" +
        "  `deleted_by` int DEFAULT NULL,\n" +
        "  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n" +
        "  `created_by` int NOT NULL DEFAULT '0',\n" +
        "  `updated_at` date DEFAULT NULL,\n" +
        "  `updated_by` int DEFAULT NULL,\n" +
        "  PRIMARY KEY (`id_cita`),\n" +
        "  KEY `id_usuario_cita_idx` (`id_usuario`),\n" +
        "  KEY `id_cliente_cita_idx` (`id_cliente`),\n" +
        "  CONSTRAINT `id_cliente_cita` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),\n" +
        "  CONSTRAINT `id_usuario_cita` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)\n" +
        ") ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3"
    )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.raw("DROP TABLE IF EXISTS `cita`");
};
