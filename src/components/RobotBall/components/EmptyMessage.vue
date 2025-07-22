<template>
  <section>
    <header class="welcome-header fs-20">
      <img src="../../../assets/images/icon-customer-server.png" class="icon-logo" />
      <span>HI，我是小Miao</span>
    </header>
    <main class="welcome-content fs-14">
      <div class="desc">
        Vue3PlusAdmin 平台专注于从创意到产品的全链路服务，打造未来生活方式的突破性产品。关于平台的产品，有问题可以随时问我
      </div>
      <div class="category-box">
        <div class="category-item">
          <img src="../../../assets/images/home/icon-protect.png" class="category-icon" />
          <div class="category-info">
            <div class="category-title fs-16">一站式协作 全链路护航</div>
            <div class="category-content fs-14">从创意孵化到市场落地，全程护航，确保项目顺利商业化</div>
          </div>
        </div>
        <div class="category-item">
          <img src="../../../assets/images/home/icon-benefit.png" class="category-icon" />
          <div class="category-info">
            <div class="category-title fs-16">让卓越的人 匹配更高回报</div>
            <div class="category-content fs-14">高价值项目灵活参与，以才华和贡献定义价值分配</div>
          </div>
        </div>
        <div class="category-item">
          <img src="../../../assets/images/home/icon-engineer.png" class="category-icon" />
          <div class="category-info">
            <div class="category-title fs-16">锁定高潜力投资标的</div>
            <div class="category-content fs-14">严选高潜力创新项目，投资收益精准可见，降低投资风险，提高资本回报</div>
          </div>
        </div>
        <div class="category-item">
          <img src="../../../assets/images/home/icon-entrepreneur.png" class="category-icon" />
          <div class="category-info">
            <div class="category-title fs-16">高效协同 共享创新红利</div>
            <div class="category-content fs-14">透明合作机制，保障供应商订单稳定，代理商利润清晰</div>
          </div>
        </div>
      </div>
    </main>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.welcome-header {
  display: flex;
  align-items: center;
  font-weight: 700;
  color: #000;
  .icon-logo {
    height: 36px;
    margin-right: 16px;
  }
}
.welcome-content {
  margin-top: 28px;
  color: rgb(0 0 0 / 80%);
  line-height: 21px;
}
.category-box {
  margin: 0 22px;
  .category-item {
    display: flex;
    margin-top: 28px;
  }
  .category-icon {
    height: 28px;
    margin-right: 16px;
  }
  .category-info {
    flex: 1;
    .category-title {
      font-weight: 700;
      color: #000;
    }
    .category-content {
      margin-top: 6px;
      color: rgb(0 0 0 / 80%);
      line-height: 21px;
    }
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 1024px) {
  .fs-20 {
    font-size: 38px !important;
  }
  .fs-14 {
    font-size: 28px !important;
  }
  .fs-16 {
    font-size: 32px !important;
  }
  .welcome-header {
    .icon-logo {
      height: 50px;
    }
  }
  .welcome-content {
    line-height: 40px;
  }
  .category-box {
    .category-item {
      display: flex;
      margin-top: 50px;
    }
    .category-icon {
      height: 46px;
      margin-right: 22px;
    }
    .category-info {
      .category-content {
        line-height: 40px;
        margin-top: 16px;
      }
    }
  }
}
</style>
