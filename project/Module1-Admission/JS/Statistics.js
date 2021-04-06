import * as util from '../repo/general-repo.js' ;
import * as AccountsRepo from '../repo/accounts-repo.js'
import * as AppRepo from '../repo/applications-repo.js';

const Logo = document.querySelector("#Himg");
const AY1 = document.querySelector("#AY1");
const AY2 = document.querySelector("#AY2");
const Table = document.querySelector('#applicationTable')

Logo.addEventListener('click', util.goPrincipleMain ) ;
AY2.addEventListener('change', listAll);


let adminAcc = await AccountsRepo.getAdmin();
AY1.disabled = true;
AY2.value = adminAcc['CurrentAY'] + 1 ; // CHANGE
AY1.value = adminAcc['CurrentAY']-3 ;// CHANGE

await listAll()




async function listAll(){
    let year = parseInt(AY2.value) - 1 ; // CHANGE
    console.log()
    if(isNaN(year))
        year =adminAcc['CurrentAY'] ;

    AY1.value = year-2 ;
    let apps = await AppRepo.getPastThreeApps(year) ;

    let years = [year-2,year-1,year] ;
    let data =  getStat(apps,years);
    toHTML(data,years)

}

function toHTML (data,Year){
    console.log(data)
    let txt = `<thead>
        <tr>
            <td>Grade</td>
            <td>Category</td>\n` ;
    for(let temp of Year)
        txt += `<td>${temp } - ${temp +1}</td>\n`
    txt+=`</tr>
        </thead> 
        <tbody> ` ;

    for (let i = 7 ; i <=9 ; i+=1)
    {   txt+=
        `<tr>
            <td rowspan="7" class="redRow">Grade ${i}</td>
            <td>Pending</td>
            <td>${data[Year[0]]['grade' + i]['Pending']}</td>
            <td>${data[Year[1]]['grade' + i]['Pending']}</td>
            <td>${data[Year[2]]['grade' + i]['Pending']}</td>
        </tr>
        <tr>
            <td>Accepted</td>
            <td>${data[Year[0]]['grade' + i]['Accepted']}</td>
            <td>${data[Year[1]]['grade' + i]['Accepted']}</td>
            <td>${data[Year[2]]['grade' + i]['Accepted']}</td>
        </tr>
        <tr>
            <td>Rejected</td>
            <td>${data[Year[0]]['grade' + i]['Rejected']}</td>
            <td>${data[Year[1]]['grade' + i]['Rejected']}</td>
            <td>${data[Year[2]]['grade' + i]['Rejected']}</td>

        </tr>
        <tr>
            <td>Withdrawn</td>
            <td>${data[Year[0]]['grade' + i]['Withdrawn']}</td>
            <td>${data[Year[1]]['grade' + i]['Withdrawn']}</td>
            <td>${data[Year[2]]['grade' + i]['Withdrawn']}</td>
        </tr>
        <tr>
            <td>Waiting List</td>
            <td>${data[Year[0]]['grade' + i]['Waitinglist']}</td>
            <td>${data[Year[1]]['grade' + i]['Waitinglist']}</td>
            <td>${data[Year[2]]['grade' + i]['Waitinglist']}</td>
        </tr>
        <tr>
            <td>Submitted</td>
            <td>${data[Year[0]]['grade' + i]['Submitted']}</td>
            <td>${data[Year[1]]['grade' + i]['Submitted']}</td>
            <td>${data[Year[2]]['grade' + i]['Submitted']}</td>
        </tr>
            <tr class="XX">
            <td class="">Total</td>
            <td class="">${Object.values(data[Year[0]]['grade' + i]).reduce((a, b) => a + b)}</td>
            <td class="">${Object.values(data[Year[1]]['grade' + i]).reduce((a, b) => a + b)}</td>
            <td class="">${Object.values(data[Year[2]]['grade' + i]).reduce((a, b) => a + b)}</td>
        </tr>

    </tbody>`
        console.log(Object.values(data[Year[1]]['grade' + i]))
    }

    Table.innerHTML = txt ;
}


// used TO FILL a COLUMN !!
function getStat(apps,Year){

    let grade = {
        Pending:0,
        Accepted:0,
        Rejected:0,
        Withdrawn:0,
        Waitinglist:0,
        Submitted:0
    } ;

    let data ={};
    // deep coping instead of shallow one
    for(let q of Year)
        data[q]= {}
    for(let q of Year)
        for( let i = 1 ; i <=12 ; i+=1) {
            data[q]['grade' + i] = JSON.parse(JSON.stringify(grade));
        }
    console.log(data)
    for( const app of apps){
        data[app.AY]['grade'+app.GradeApplyingFor][app.Status] +=1  ;
    }
    return data ;
}
