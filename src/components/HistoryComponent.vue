<template>
  <div id="root">
    <div id="buttons_bar">
      <img
        class="button"
        src="../assets/images/first_item.png"
        @click="gotoFirst"
      />
      <img
        class="button"
        src="../assets/images/previous_item.png"
        @click="gotoPrevious"
      />
      <img
        class="button"
        src="../assets/images/next_item.png"
        @click="gotoNext"
      />
      <img
        class="button"
        src="../assets/images/last_item.png"
        @click="gotoLast"
      />
    </div>
    <div id="content" :style="rootStyle">
      <span
        v-for="(item, index) in items"
        :id="'item_' + index"
        :key="index"
        :class="{ selectedNode: index === selectedNodeIndex }"
        @click="handleItemClick(index)"
      >
        {{ item.text + " " }}
      </span>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  props: {
    width: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const rootStyle = `width: ${props.width}; height: ${props.height}`;
    const selectedNodeIndex = ref(undefined);
    const items = ref([]);

    function handleItemClick(index) {
      const item = items.value[index];

      if (!item.positionFen) return;
      context.emit("position-request", { ...item, index });
    }

    function newGame() {
      items.value.splice(0, items.value.length);
      selectedNodeIndex.value = undefined;
    }

    function addItem(itemData) {
      if (itemData.whiteTurn) {
        items.value.push({ text: `${itemData.moveNumber}.` });
      }
      items.value.push({ ...itemData, text: itemData.moveFan });
      setTimeout(scrollToBottom, 15);
    }

    function notifyNodeSelected(index) {
      selectedNodeIndex.value = index;
      const itemDom = document.querySelector('#item_'+index);
      const contentDom = document.querySelector('#content');
      if (itemDom) contentDom.scrollTo({top: itemDom.offsetTop - contentDom.offsetTop});
    }

    function scrollToBottom() {
      const contentDom = document.querySelector('#content');
      const lastIndex = items.value.length - 1;
      const lastItemDom = document.querySelector('#item_'+lastIndex);
      if (lastItemDom) contentDom.scrollTo({top: lastItemDom.offsetTop - contentDom.offsetTop});
    }

    function gotoFirst() {
      context.emit("position-request", {});
    }

    function gotoPrevious() {
      // We don't want to update selected node until confirmation from board.
      let tempNodeIndex = selectedNodeIndex.value;

      // we are on start position
      if (tempNodeIndex === 1) {
        // Goto first
        context.emit("position-request", {});
      } else if (tempNodeIndex > 0) {
        do {
          tempNodeIndex--;
        } while (!items.value[tempNodeIndex].positionFen);
        const item = items.value[tempNodeIndex];
        context.emit("position-request", { ...item, index: tempNodeIndex });
      }
    }

    function gotoNext() {
      // We don't want to update selected node until confirmation from board.
      let tempNodeIndex = selectedNodeIndex.value;

      // if on start position
      if (tempNodeIndex === undefined || tempNodeIndex < 1) {
        // we skip move number
        tempNodeIndex = 1;

        const item = items.value[tempNodeIndex];
        context.emit("position-request", { ...item, index: tempNodeIndex });
      } else {
        do {
          if (tempNodeIndex >= items.value.length - 1) break;
          tempNodeIndex++;
        } while (!items.value[tempNodeIndex].positionFen);
        const item = items.value[tempNodeIndex];

        context.emit("position-request", {
          ...item,
          index: tempNodeIndex,
        });
      }
    }

    function gotoLast() {
      const tempNodeIndex = items.value.length - 1;
      const item = items.value[tempNodeIndex];
      context.emit("position-request", {
        ...item,
        index: tempNodeIndex,
      });
    }

    return {
      items,
      rootStyle,
      selectedNodeIndex,
      handleItemClick,
      notifyNodeSelected,
      gotoFirst,
      gotoPrevious,
      gotoNext,
      gotoLast,
      newGame,
      addItem,
    };
  },
};
</script>

<style scoped>
#root {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

#buttons_bar {
  width: 350px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

.button {
  border: 1px solid black;
  width: 30px;
  height: 30px;
}

#content {
  font-family: "Free Serif";
  font-size: 30px;
  background-color: beige;
  text-align: start;
  overflow-y: scroll;
}

.selectedNode {
  background-color: yellow;
}
</style>