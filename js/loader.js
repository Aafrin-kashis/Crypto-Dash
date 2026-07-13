async function loadComponent(id, file){

  try{

    const response = await fetch(file);

    const data = await response.text();

    document.getElementById(id).innerHTML = data;

  }

  catch(error){

    console.log("Component loading failed:", error);

  }

}


loadComponent("header","components/header.html");

loadComponent("footer","components/footer.html");



function applyTheme(){

  const savedTheme = localStorage.getItem("theme");

  if(savedTheme === "dark"){

    document.body.classList.add("dark");

  }

}



document.addEventListener("click",(e)=>{


  if(e.target.id === "themeToggle"){


    document.body.classList.toggle("dark");


    const theme =
    document.body.classList.contains("dark")
    ? "dark"
    : "light";


    localStorage.setItem(
      "theme",
      theme
    );


  }


});



applyTheme();