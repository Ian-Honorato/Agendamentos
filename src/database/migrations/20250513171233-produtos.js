"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("produtos", {
      id_produto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome_produto:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      estoque_produto:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      preco_produto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      descricao_produto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imagem_produto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      categoria_produto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categorias",
          key: "id_categoria",
        },
          onDelete: "RESTRICT",
          onUpdate: "CASCADE",
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("produtos");
  },
};
