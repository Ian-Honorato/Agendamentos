"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("trocas", {
      id_troca: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      state: {
        type: Sequelize.ENUM('pendente', 'aceita', 'recusada', 'finalizada'),
        allowNull: false,
        defaultValue: 'pendente',
      },
      data: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      usuario_solicitante_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
        
      },
      usuario_solicitado_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
        
      },
      valor_total:{
        type:Sequelize.DECIMAL(10, 2),
        allowNull:false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("trocas");
  },
};
