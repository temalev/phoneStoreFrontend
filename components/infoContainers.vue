<template>
  <div class="mainInfoContainers">
    <div class="container-tradeIn">
      <div class="container-text">
        <h3 class="header-container">Программа Trade-In</h3>
        <p class="textInfo">И как она работает.</p>
      </div>
    </div>
    <div class="flex">
      <div class="container-service"></div>
      <!-- <div class="container-oldTech">
        <div class="container-text">
          <h3 class="header-container">
            Продажа устройств, бывших в употреблении
          </h3>
        </div>
      </div> -->
    </div>

    <div class="container">
      <div class="text">
        <h3 class="gradient">Рассрочка</h3>
        <p class="textInfo">Нажмите, чтобы узнать подробности</p>
      </div>
      <div class="img" />
    </div>

    <div class="row">
      <div class="leftContainer">
        <div class="textInfoContainer">
          <h3 class="header">Оригинальность и гарантия</h3>
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
            <h3 class="header">Способы оплаты</h3>
            <p class="textInfo">
              Оплачивайте покупки удобным для вас способом.
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
            style="background-image: url(/images/delivery.webp); width: 350px"
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
  height: 100%;
  @media (max-width: 850px) {
    flex-direction: column;
    height: 100%;
    min-height: 800px;
    margin: 0;
  }
}

.container-service {
  background-image: url(/images/rk_service.webp);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 100%;
  height: 300px;
  box-shadow: inset 0 0 30px #f9f9fb;
  border-radius: 22px;
  @media (max-width: 900px) {
    min-width: 280px;
    height: 160px;
    padding: 24px;
    width: auto;
    margin: 0 20px;
    box-shadow: 0 0 10px rgb(212 212 212);
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
  justify-content: space-between;
  gap: 20px;
  max-width: 1500px;
  @media (max-width: 850px) {
    flex-direction: column;
    gap: 20px;
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
    min-width: 280px;
    box-shadow: 0 0 10px rgb(212 212 212);
    margin: 0 20px;
  }
  cursor: pointer;
}

.container-tradeIn {
  background-color: #f9f9fb;
  // box-shadow: 0 0 10px #d4d4d4;
  box-sizing: border-box;
  background-image: url(/images/tradein.webp);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 500px;
  cursor: pointer;
  border-radius: 22px;
  @media (max-width: 900px) {
    background-image: url(/images/tradein_mobile.webp);
    min-width: 280px;
    height: 380px;
    padding: 24px;
    width: auto;
    margin: 0 20px;
    box-shadow: 0 0 10px rgb(212 212 212);
  }
}

.container-oldTech {
  background-color: #f9f9fb;
  // box-shadow: 0 0 10px #d4d4d4;
  border-radius: 22px;
  box-sizing: border-box;
  background-image: url(/images/oldTech.webp);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  cursor: pointer;
  @media (max-width: 900px) {
    background-image: url(/images/oldTech_mobile.webp);
    min-width: 280px;
    width: auto;
    height: 220px;
    padding: 24px;
    margin: 0 20px;
    box-shadow: 0 0 10px rgb(212 212 212);
  }
}

.container-text {
  padding: 32px;
  @media (max-width: 900px) {
    font-size: 16px;
    padding: 0;
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
  background-image: url("../images/credit.webp");
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
  background-image: url(/images/applecare.webp);
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
  background-image: url(/images/pay.webp);
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
  background-image: url(/images/cost.webp);
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
    height: 250px;
    margin: 0 20px;
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
