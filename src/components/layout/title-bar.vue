<template>
  <div id="title-bar" class="container-fluid">
    <div class="row">
      <div class="col content-offset display-6 title-text align-mid">
        NSWC Crane Stem Lending Library
      </div>
    </div>
  </div>
</template>
<style scoped>
#title-bar {
  min-height: 4rem;
  max-height: 4rem;

  @media (max-width: 600px) {
    min-height: 2.5rem;
    max-height: 2.5rem;
    .title-text {
      font-size: 1.7rem;
    }
  }

  @media (max-width: 400px) {
    min-height: 2rem;
    max-height: 2rem;
    .title-text {
      font-size: 1.25rem;
    }
  }
}

.content-offset {
}
</style>
