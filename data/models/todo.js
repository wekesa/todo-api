/**
 * Created by wekesa on 9/25/16.
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('todo', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 250]
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 250]
            }
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
}