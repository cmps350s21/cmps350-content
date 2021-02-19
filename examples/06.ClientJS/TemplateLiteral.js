// Expression interpolation
const a = 5, b = 10;
console.log(`${a} + ${b} = ${a + b}`);

// Conditional expression
const isHappy = true;
const state = `${ isHappy ? '😀' : '😢'}`;
console.log(state);

// Loop
const  days = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];
const daysHtml = `<ul>
   ${days.map(day => `<li>${day}</li>`).join('\n')}
</ul>`;
console.log(daysHtml);

// HTML Template
const person = {
    name: 'Mr Bean',
    job: 'Comedian',
    hobbies: ['Make people laugh', 'Do silly things', 'Visit interesting places']
}

function personTemplate({name, hobbies, job}){
    return `<article class="person">
               <h3>${name}</h3>
               <p>Current job: ${job}</p>
               <div>
                   <div>Hobbies:</div>
                   <ul>
                       ${hobbies.map(hobby => `<li>${hobby}</li>`).join(" ")}
                   </ul>
               </div>
    </article>`;
}

const personHtml = personTemplate(person);
// document.body.innerHTML = personHtml; // to display it on the browser
console.log(personHtml);