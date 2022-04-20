import React from "react";

export default function Carousel() {
  return (
    <div
      id="carouselExampleCaptions"
      class="carousel slide"
      data-bs-ride="carousel"
    >
      <div class="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="0"
          class="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
         <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="3"
          aria-label="Slide 4"
        ></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img
          	
            src="https://pixelplex.io/wp-content/uploads/2021/02/blockchain-voting-main-1600.jpg"
            style={{ height: "500px" }}
            class="d-block w-100"
            alt="..."
          />
          <div class="carousel-caption d-none d-md-block">
            <h5>First slide label</h5>
            <p>A trusted decentralise voting sysy for institutions</p>
          </div>
        </div>
        <div class="carousel-item">
          <img
            src="https://theprivacyissue.com/assets/img/evoting.jpg"
            style={{ height: "500px" }}
            class="d-block w-100"
            alt="..."
          />
          <div class="carousel-caption d-none d-md-block">
            <h5>Second slide label</h5>
            <p>Some representative placeholder content for the second slide.</p>
          </div>
        </div>
        <div class="carousel-item">
          <img
         src="https://affidaty.io/blog/wp-content/uploads/2019/05/VotoBlockchain-2-1024x680.jpg.webp"
            class="d-block w-100"
            style={{ height: "500px" }}
            alt="..."
          />
          <div class="carousel-caption d-none d-md-block">
            <h5 className="text-secondary">Third slide label</h5>
            <p className="text-secondary">Some representative placeholder content for the third slide.</p>
          </div>
        </div>
        <div class="carousel-item">
          <img
            src="https://creditkarma-cms.imgix.net/wp-content/uploads/2020/08/requirements-to-vote.png?w=1024&fm=webp"
            class="d-block w-100"
            style={{ height: "500px" }}
            alt="..."
          />
          <div class="carousel-caption d-none d-md-block">
            <h5>Fouth slide label</h5>
            <p>Some representative placeholder content for the third slide.</p>
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  );
}
