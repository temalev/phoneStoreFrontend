<template>
  <div class="mainInfoContainers">
    <div class="container">
      <div class="text">
        <h3 class="gradient">Рассрочка</h3>
      <p class="textInfo">Нажмите, чтобы узнать подробности</p>
      </div>
      <div class="img" />
    </div>

    <div class="flex">
      <div class="container-tradeIn">
        <h3>Программа Trade-In</h3>
        <div class="img-tradeIn" />
        </div>
      <div class="container-oldTech">
        <h3>Продажа устройств, бывших в употреблении</h3></div>
        <div class="img-oldTech" />
    </div>

    <div class="row">
      <div class="leftContainer">
        <div class="textInfoContainer">
          <h3 class="header">Оригинальность</h3>
          <p class="textInfo">
            Вся техника, представленная в нашем магазине, только новая и
            оригинальная.
          </p>
        </div>
        <div class="imgBackground__leftContainer" />
      </div>

      <div class="rightContainers">
        <div class="rightContainer">
          <div class="textInfoContainer">
            <h3 class="header">Оплата</h3>
            <p class="textInfo">
              Оплачивайте в той валюте, в которой удобно вам.
            </p>
          </div>
          <div class="imgBackground__rightContainer" />
        </div>

        <div class="rightContainer">
          <div class="textInfoContainer">
            <h3 class="header">Доставка</h3>
            <p class="textInfo">
              Мы осуществляем курьерскую доставку в Москве и Московской области,
              а также в г. Рязань с помощью собственного штата курьеров.
            </p>
          </div>
          <div
            class="imgBackground__rightContainer"
            style="background-image: url(/images/delivery.jpg); width: 350px"
          />
        </div>
      </div>
    </div>

    <div class="cost">
      <div class="textContainer">
        <h3>Гарантия лучшей цены</h3>
        <p class="info">
          «Гарантия лучшей цены» дает вам уверенность в том, что делаете покупку
          по самой выгодной цене.
        </p>
      </div>
      <CustomButton class="btn" name="Как это работает?" />

      <!-- <img class="cost" src="/images/cost.jpeg" alt="" /> -->
    </div>
  </div>
</template>

<script></script>

<style scoped lang="scss">
.mainInfoContainers {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 80px;
  @media (max-width: 850px) {
    flex-direction: column;
    height: 100%;
    min-height: 800px;
    margin: 20px;
  }
}
.row {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  cursor: pointer;
  @media (max-width: 850px) {
    flex-direction: column;
    height: 100%;
    min-height: 800px;
    margin: 0 20px;
  }
}

.flex {
  display: flex;
  @media (max-width: 850px) {
    flex-direction: column;
  }
}

.leftContainer {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  height: 400px;
  background-color: #fff;
  box-shadow: 0 0 10px rgb(212, 212, 212);
  border-radius: 22px;

  @media (max-width: 900px) {
    height: 275px;
    flex: none;
  }
}

.container {
  background-color: #f9f9fb;
  // box-shadow: 0 0 10px #d4d4d4;
  border-radius: 22px;
  box-sizing: border-box;
  @media (max-width: 900px) {
    margin: 12px 20px;
    min-width: 280px;
    box-shadow: 0 0 10px rgb(212 212 212);
  }
  cursor: pointer;
}

.container-tradeIn {
  background-color: #f9f9fb;
  // box-shadow: 0 0 10px #d4d4d4;
  border-radius: 22px;
  box-sizing: border-box;
  @media (max-width: 900px) {
    margin: 12px 20px;
    min-width: 280px;
    height: 160px;
    padding: 24px;
    box-shadow: 0 0 10px rgb(212 212 212);
    background-image: url(/images/tradeIn.jpg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}

.text {
  padding: 34px;

  @media (max-width: 900px) {
    font-size: 16px;
    padding: 24px;
  }
  .gradient {
    display: inline;
    // background: -webkit-linear-gradient(180deg, #ed6247, #ed5ba0, #647fe7);
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
  }
}

.list {
  display: flex;
  justify-content: center;
}

.img {
  background-image: url("../images/credit.jpeg");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  max-width: 1500px;
  height: 200px;
  @media (max-width: 900px) {
    height: 62px;
  }
}

.rightContainers {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  gap: 20px;
}

.wrap {
  display: flex;
  gap: 5px;
}

.rightContainer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  flex: 1;
  position: relative;
  box-shadow: 0 0 10px rgb(212, 212, 212);
  border-radius: 22px;
  overflow: hidden;
}

.textInfoContainer {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-family: Helvetica, Arial, sans-serif;
  width: 280px;
  z-index: 2;
  margin: 30px;
  position: absolute;
  left: 0;
  @media (max-width: 900px) {
    margin: 12px 20px;
    min-width: 280px;
    width: fit-content;
  }
}

.imgBackground__leftContainer {
  background-image: url(/images/applecare.jpeg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  width: 100%;
  height: 400px;
  bottom: 0;
  z-index: 1;
  @media (max-width: 900px) {
    height: 220px;
  }
}

.imgBackground__rightContainer {
  background-image: url(/images/pay.jpg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  width: 275px;
  @media (max-width: 850px) {
    height: auto;
  }
}

.cost {
  position: relative;
  background-image: url(/images/cost.jpeg);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 300px;
  border-radius: 22px;
  padding: 50px;
  box-sizing: border-box;
  @media (max-width: 850px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 20px;
    width: auto;
    margin: 0 20px;
    height: 250px;
    box-shadow: 0 0 10px rgb(212 212 212);
  }
}

.textContainer {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info {
  max-width: 500px;
}

.btn {
  position: absolute;
  right: 50px;
  top: 220px;
  width: 300px;
  @media (max-width: 850px) {
    position: static;
    width: 250px;
  }
}
</style>
