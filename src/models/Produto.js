import Sequelize, { DataTypes, Model } from "sequelize";

export default class Produto extends Model {
  static init(sequelize) {
    super.init(
      {
        id_produto: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nome_produto: {
          type: DataTypes.STRING,
          allowNull: false,
        },
          estoque_produto: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }, 
        preco_produto: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        descricao_produto: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        imagem_produto: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        categoria_produto: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "categorias", 
            key: "id_categoria",
          },
          onDelete: "CASCADE",
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },

      {
        sequelize,
        tableName: "produtos",
      }
    );

    return this;
  }

  static associate(models) {
  
    this.belongsTo(models.Categoria, {
      foreignKey: "categoria_produto",
      as: "categoria", 
    });
    this.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    })
    this.belongsToMany(models.Troca, {
      through: 'produtos_na_troca',
      foreignKey: 'id_produto',
      otherKey: 'id_troca',
      as: 'trocas',
    });
  }
}
