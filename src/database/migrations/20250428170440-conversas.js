"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("conversas", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_remetente:{
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model: "users",
          key: "id",   
      },

      },
      user_destinatario:{
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
            model: "users",
            key: "id",   
        },
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
    await queryInterface.dropTable("conversas");
  },
};
