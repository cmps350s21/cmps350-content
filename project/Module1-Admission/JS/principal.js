import * as util from '../repo/general-repo.js' ;
import * as AccountsRepo from '../repo/accounts-repo.js'
import * as AppRepo from '../repo/applications-repo.js';

const FilterByStatus = document.querySelector("#Status");
const FilterByYear = document.querySelector("#SacademicYear");
const FilterByYearEnd = document.querySelector("#EacademicYear");
const CurrentYear = document.querySelector("#SetacademicYear1");
const CurrentYearEnd = document.querySelector("#SetacademicYear2");
const Logo = document.querySelector("#Himg");
const Table = document.querySelector('tbody');

Logo.addEventListener('click',util.goPrincipleMain ) ;
CurrentYear.addEventListener('change',Setyear)
FilterByStatus.addEventListener('change',FilterByStatusHandler)
FilterByYear.addEventListener('change', filteryear);
FilterByYearEnd.addEventListener('change', filteryear);

// The current AY
let adminAcc = await AccountsRepo.getAdmin();
CurrentYearEnd.disabled = true;
CurrentYear.value = adminAcc['CurrentAY'];
CurrentYearEnd.value = adminAcc['CurrentAY']+1 ;

let allApps = await AppRepo.getAllApps() ;
displayAll(allApps) ;



FilterByYear.value = adminAcc['CurrentAY'] ;
FilterByYearEnd.value = adminAcc['CurrentAY']+1 ;

filteryear();

async function Setyear(event){
    adminAcc['CurrentAY'] =  parseInt(CurrentYear.value) ;
    CurrentYearEnd.value =  adminAcc['CurrentAY'] + 1 ;
    await AccountsRepo.updateAdmin(adminAcc) ;
}

function displayAll(x) {
    let txt = x.map( w => applicationToHTML(w)).join("\n");
    Table.innerHTML =txt ;
}

function applicationToHTML( app ) {
    return `<tr class="LINKED" onclick="TEST(${app.id})">
    <td>${app.id}</td>
    <td>${app.UserName}</td>
    <td>${app.AY} - ${app.AY+1}</td>
    <td>${new Date(app.date).toISOString().slice(0,10)}</td>
    <td>${app.FirstName}</td>
    <td>${app.Status}</td>
</tr> 
`  ;
}

window.TEST = TEST ;
function TEST(x){
    localStorage.applicationID = x ;
    window.location.href='./principal-view.html'

}

// Filter by Status
function FilterByStatusHandler(){
    FilterByYear.value= ""
    FilterByYearEnd.value=""
    let temp ;
    console.log(FilterByStatus.value)
    if(FilterByStatus.value != "all") {
        temp = [];
        for (const app of allApps)
            if (app.Status == FilterByStatus.value)
                temp.push(app);
    }
    else{
    temp = allApps;
        }

    displayAll(temp)
}

// Filter by start year
function filteryear(){
    let startYear = parseInt(FilterByYear.value) ;
    let endYear =  parseInt(FilterByYearEnd.value) ;
    FilterByStatus.value = 'all'
    startYear = isNaN(startYear) ? -1 :startYear ;
    endYear = isNaN(endYear) ? 1000000 :endYear ;

    console.log(startYear,endYear)
    let temp = [ ] ;
    for( const app of allApps)
        if(app.AY >=  startYear && app.AY+1 <=  endYear)
            temp.push(app);
    displayAll(temp)
}

