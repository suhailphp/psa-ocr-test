var pageLimit = 10;
module.exports = {
    getPagination: function (conf) {

        var currentPage = parseInt(conf['pageNo']) | 0;
        currentPage = currentPage < 0 ? 0 : currentPage;

        // console.log('pageLimit', pageLimit)
        // console.log('currentPage', currentPage)

        var totalRecord = conf.count;
        var totalPages = Math.ceil(totalRecord / pageLimit);
        totalPages = totalPages > 0 ? totalPages : 1;


        var pages = [];
        currentPage = currentPage != null && currentPage > 0 ? currentPage : 1;
        currentPage = totalRecord >= pageLimit ? currentPage : 1;


        var start = (currentPage - 3 > 0 ? currentPage - 3 : 1);
        var end = (totalRecord > start + 3 ? start + 6 : totalRecord);
        end = end > totalPages ? totalPages : end;
        // console.log('start', start)
        // console.log('end', end)
        // console.log('totalRecord', totalRecord)
        // console.log('pageLimit', pageLimit)
        // console.log('totalPages', totalPages)
        var first = true, last = true;
        for (var i = start; i <= end; i++) {
            pages.push(i);
            if (i == 1)
                first = false;
            if (i == totalPages)
                last = false;
        }

        return {
            urlPreFix: conf.url + '?pageNo=',
            urlPostFix:
                conf.req
                    ?
                    ( conf.req.query['sort'] ? '&sort=' + conf.req.query['sort'] + '&order=' + conf.req.query['order'] : '')
                    :
                    '',
            pages: pages,
            pageCount: totalPages,
            currentPageNo: currentPage,
            showingFrom: (currentPage - 1) * pageLimit + 1,
            showingTo: (currentPage * pageLimit) > totalRecord ? totalRecord : (currentPage * pageLimit),
            totalRecordCount: totalRecord,
            thisPageCount: conf.count,
            first: first,
            last: last,
        }

    },
    getPrePagination: function (conf) {
        var currentPage = parseInt(conf['pageNo']) | 0;
        currentPage = currentPage < 0 ? 0 : currentPage;

        return {
            limit: pageLimit,
            offset: (currentPage > 0 ? currentPage - 1 : currentPage) * pageLimit,
        }
    },
    getPagination2: function (conf) {

        var currentPage = parseInt(conf['pageNo']) | 0;
        currentPage = currentPage < 0 ? 0 : currentPage;

        // console.log('pageLimit', pageLimit)
        // console.log('currentPage', currentPage)

        var totalRecord = conf.count;
        var totalPages = Math.ceil(totalRecord / pageLimit);
        totalPages = totalPages > 0 ? totalPages : 1;


        var pages = [];
        currentPage = currentPage != null && currentPage > 0 ? currentPage : 1;
        currentPage = totalRecord >= pageLimit ? currentPage : 1;


        var start = (currentPage - 3 > 0 ? currentPage - 3 : 1);
        var end = (totalRecord > start + 3 ? start + 6 : totalRecord);
        end = end > totalPages ? totalPages : end;
        // console.log('start', start)
        // console.log('end', end)
        // console.log('totalRecord', totalRecord)
        // console.log('pageLimit', pageLimit)
        // console.log('totalPages', totalPages)
        var first = true, last = true;
        for (var i = start; i <= end; i++) {
            pages.push(i);
            if (i == 1)
                first = false;
            if (i == totalPages)
                last = false;
        }

        return {
            urlPreFix: conf.url + '?pageNo=',
            urlPostFix: conf.url + '&',
            pages: pages,
            pageCount: totalPages,
            currentPageNo: currentPage,
            showingFrom: (currentPage - 1) * pageLimit + 1,
            showingTo: (currentPage * pageLimit) > totalRecord ? totalRecord : (currentPage * pageLimit),
            totalRecordCount: totalRecord,
            thisPageCount: conf.count,
            first: first,
            last: last,
        }

    },
    getPrePagination: function (conf) {
        var currentPage = parseInt(conf['pageNo']) | 0;
        currentPage = currentPage < 0 ? 0 : currentPage;

        return {
            limit: pageLimit,
            offset: (currentPage > 0 ? currentPage - 1 : currentPage) * pageLimit,
        }
    }
}