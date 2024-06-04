import App from './App';
import './style.scss'


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <section class="p-section-hero"></section>
`;


async function mainAsync(){
  (window as any).app=new App();
}


mainAsync().catch((error)=>{
  console.error(error);
});
