export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('produtos_na_troca', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nome_snapshot: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      preco_snapshot: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      id_produto: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'produtos', key: 'id_produto' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      id_troca: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'trocas', key: 'id_troca' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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

  down: async (queryInterface) => {
    await queryInterface.dropTable('produtos_na_troca');
  },
};
