/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.raw(
        "CREATE TABLE `historial` (\n" +
        "  `id_historial` int NOT NULL AUTO_INCREMENT,\n" +
        "  `id_cliente` int NOT NULL,\n" +
        "  `motivo` varchar(30) NOT NULL,\n" +
        "  `diagnostico` mediumtext NOT NULL,\n" +
        "  `deleted` tinyint NOT NULL DEFAULT '0',\n" +
        "  `deleted_at` date DEFAULT NULL,\n" +
        "  `deleted_by` int DEFAULT NULL,\n" +
        "  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,\n" +
        "  `created_by` int NOT NULL DEFAULT '0',\n" +
        "  `updated_at` date DEFAULT NULL,\n" +
        "  `updated_by` int DEFAULT NULL,\n" +
        "  PRIMARY KEY (`id_historial`),\n" +
        "  KEY `id_cliente_historial_idx` (`id_cliente`),\n" +
        "  CONSTRAINT `id_cliente_historial` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`)\n" +
        ") ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb3"
    )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.raw("DROP TABLE IF EXISTS `historial`");
};
