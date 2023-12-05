/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(
      "CREATE TABLE usuario (id_usuario int NOT NULL AUTO_INCREMENT,email varchar(60) NOT NULL,password mediumtext NOT NULL,nombre varchar(50) NOT NULL,apellido_paterno varchar(15) NOT NULL DEFAULT 'apellidopaterno',apellido_materno varchar(15) NOT NULL DEFAULT 'apellidomaterno',fotografia varchar(500) DEFAULT NULL,deleted tinyint NOT NULL DEFAULT '0',created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at date DEFAULT NULL,deleted_at date DEFAULT NULL,PRIMARY KEY (id_usuario),FULLTEXT KEY email (email)) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb3"
  )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.raw("DROP TABLE IF EXISTS `usuario`");
};
