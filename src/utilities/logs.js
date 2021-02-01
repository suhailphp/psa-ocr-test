module.exports.CreateLogs = function (Models,Type,Mode,UserName,TargetID = 0,Info = '') {
        Models
            .Logs
            .create({
                Type:Type,
                Mode:Mode,
                Info:Info,
                TargetID:TargetID,
                UserName:UserName
            })
    }
