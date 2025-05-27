import Sequelize, { DataTypes, Model } from "sequelize";


export default class Carteira extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
       moedas: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull:false,
        },
        
      },
      {
        sequelize,
        tableName: "carteiras",
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  }
}
