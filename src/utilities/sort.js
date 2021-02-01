module.exports = {
    getSorting: function (conf) {


        let url = conf.req.originalUrl.split("?").shift();

        let order = conf.req.query['order'] || 'ASC';
        order = order == 'ASC' ? 'DESC' : 'ASC';

        let pageNo = conf.req.query['pageNo'] || '1';

        let list = {}
        for (let i = 0; i < conf.fields.length; i++)
            list[conf.fields[i]] = url + '?pageNo=' + pageNo + '&sort=' + conf.fields[i] + '&order=' + order

        return list;
    }
}