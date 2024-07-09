// DROP TABLE IF EXISTS tblpermisos;

// CREATE TABLE IF NOT EXISTS tblpermisos (
//   permiso char(6) NOT NULL UNIQUE,
//   descripcion varchar(255) NOT NULL
// );

// INSERT INTO tblpermisos (permiso, descripcion) VALUES 
//   ("USR-LS", "Usuarios - Solo ver lista de usuarios"),
//   ("USR-RO", "Usuarios - Ver el detalle de un usuario"),
//   ("USR-WR", "Usuarios - Ver/Modificar el detalle de un usuario");

// // -- SELECT * FROM tblpermisos LIMIT 1 OFFSET 0;

// DROP TABLE IF EXISTS tblusuarios;

// CREATE TABLE tblusuarios (
//   id char(36) NOT NULL,
//   nombre varchar(255) NOT NULL,	
//   correo varchar(255) NOT NULL UNIQUE,	
//     contraseya TEXT NOT NULL,
//   estado varchar(10) NOT NULL default 'Activo',
//   PRIMARY KEY (`id`)
// );

// INSERT INTO tblusuarios (id, nombre, correo, contraseya) VALUES
//   (uuid(), "uno", "uno@a", "uno"),
//     (uuid(), "dos", "dos@a", "dos"),
//     (uuid(), "tres", "tres@a", "tres"),
//     (uuid(), "cuatro", "cuatro@a", "cuatro"),
//     (uuid(), "cinco", "cinco@a", "cinco");

// DROP TABLE IF EXISTS tblusuarios_tblpermisos;

// CREATE TABLE tblusuarios_tblpermisos (
//   usuario_id char(36) NOT NULL,
//   permiso_id char(6) NOT NULL,
//   PRIMARY KEY (usuario_id,permiso_id)
// );

// INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) VALUES
//   ((SELECT id FROM tblusuarios where nombre = "uno"), "USR-LS"),
//     ((SELECT id FROM tblusuarios where nombre = "uno"), "USR-RO"),
//     ((SELECT id FROM tblusuarios where nombre = "uno"), "USR-WR"),
//     ((SELECT id FROM tblusuarios where nombre = "dos"), "USR-LS"),
//     ((SELECT id FROM tblusuarios where nombre = "dos"), "USR-WR"),
//     ((SELECT id FROM tblusuarios where nombre = "tres"), "USR-LS"),
//     ((SELECT id FROM tblusuarios where nombre = "cuatro"), "USR-WR"),
//     ((SELECT id FROM tblusuarios where nombre = "cinco"), "USR-RO");