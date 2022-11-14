import React from "react";

function Carousel(props) {

  const links = props.links

  return (
    <div className="main-carousel">
      <div id="carouselExampleIndicators"  class="carousel slide"  data-bs-ride="true">
        <div class="carousel-indicators">
          {links.map(link=>(
            <button key={link.id} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={link.id - 1} class={link.id === 1? "active" : ""} aria-current={link.id === 1? "true":""} ></button>
          ))}

        </div>
        <div class="carousel-inner">
          {links.map(link=>(
             <div class={link.id===1?"carousel-item active":"carousel-item"}>
             <img src="https://miro.medium.com/max/1600/1*Rv0RecX9Th90htNyv46TAw.png" class="d-block w-100"  alt=""/>
           </div>
          ))}
        </div>
        <button class="carousel-control-prev"  type="button" data-bs-target="#carouselExampleIndicators"  data-bs-slide="prev"  >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button class="carousel-control-next"  type="button"  data-bs-target="#carouselExampleIndicators"  data-bs-slide="next"   >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  );
}

export default Carousel;
