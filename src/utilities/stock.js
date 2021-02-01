const sequelize = require('sequelize');
module.exports = {
    getItemStock: async function (Models,ItemID,WorkOrderID = 0) {
        let stock = 0;

        let item = await Models.Item.findOne({where:{ItemID:ItemID}})

        let openingStock  = (item && item.OpeningStock && item.OpeningStock > 0)? item.OpeningStock:0;

        // let purchases = await Models.PartsPurchaseItem.findAll({
        //
        //     attributes: [[sequelize.fn('sum', sequelize.col('Quantity')), 'total']],
        //     where: {ItemID: ItemID },
        //     group : ['ItemID'],
        //     raw: true,
        //     order: sequelize.literal('total DESC')
        // });
        //
        //
        // let totalPurchase = ((purchases.length > 0) && purchases[0].total > 0)? purchases[0].total:0;
        //
        // let issues = await Models.WorkOrderParts.findAll({
        //     attributes: [[sequelize.fn('sum', sequelize.col('Quantity')), 'total']],
        //     where: {ItemID: ItemID,WorkOrderID:{$ne:WorkOrderID} },
        //     group : ['ItemID'],
        //     raw: true,
        //     order: sequelize.literal('total DESC')
        // });
        //
        // let totalIssue = ((issues.length > 0) && issues[0].total > 0)? issues[0].total:0;
        //
        // stock = (openingStock+totalPurchase)-totalIssue
        return (openingStock)
    }
}