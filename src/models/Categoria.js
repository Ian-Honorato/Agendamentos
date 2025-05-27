import Sequelize, { DataTypes, Model } from "sequelize";


export default class Categoria extends Model {
  static init(sequelize) {
    super.init(
      {
        id_categoria: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nome_categoria: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        tableName: "categorias",
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Produto, {
      foreignKey: "categoria_produto",
      as: "produto",
    });
  }
}
