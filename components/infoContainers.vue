<template>
  <div class="mainInfoContainers">
    <div class="row">
      <div class="leftContainer">
        <div class="textInfoContainer">
          <h3 class="header">Оригинальность</h3>
          <p class="textInfo">
            Вся техника, представленная в нашем магазине, только новая и оригинальная.
          </p>
        </div>
        <div class="imgBackground__leftContainer" />
      </div>

      <div class="rightContainers">
        <div class="rightContainer">
          <div class="textInfoContainer">
            <h3 class="header">Оплата</h3>
            <p class="textInfo">Оплачивайте в той валюте, в которой удобно вам.</p>
          </div>
          <div class="imgBackground__rightContainer" />
        </div>

        <div class="rightContainer">
          <div class="textInfoContainer">
            <h3 class="header">Доставка</h3>
            <p class="textInfo">
              Мы осуществляем курьерскую доставку в Москве и Московской области, а также в г. Рязань
              с помощью собственного штата курьеров.
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
          «Гарантия лучшей цены» дает вам уверенность в том, что делаете покупку по самой выгодной
          цене.
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
    margin: 20px;
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
    height: 300px;
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

.textInfo {
  // display: inline;
  // background-color: rgba(255, 255, 255, 0.636);
  // border-radius: 2px;
  // padding-right: 5px;
  // -webkit-box-decoration-break: clone;
  // box-decoration-break: clone;
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
    height: 300px;
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
    padding: 40px 50px;
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
