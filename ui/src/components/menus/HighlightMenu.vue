<template>
    <div
    class="bg-paper flex absolute outline-none shadow-menu overflow-auto rounded-2 scrollbar-small flex-col"
        tabIndex="0"
        :style="{ 
            ...contextmenu.location, 
            top: `calc(${contextmenu.location.top} - 
                ${hasMark.get('hyperlink') || hasMark.get('engramlink') ? (24 + 32): 24}px)`,
            width: 'auto'
        }"
    >
        <input
            v-if="hasMark.get('hyperlink')"
            type="text"
            v-model="linkvalue"
            class="px-3 py-2 outline-none"
            @blur="(event) => {
                implementLink();
            }"
            placeholder="https://"
        />

      <div class="flex">
        <div
            class="highlightmenu-item"
          @click="toggleMark('strong')"
          :class="{
            'bg-border': hasMark.get('strong')
          }"
        >
          <!-- Bold -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            width="16"
            height="16"
            fill="var(--rlm-text-color, #333333)"
          >
            <path d="M321.1 242.4C340.1 220.1 352 191.6 352 160c0-70.59-57.42-128-128-128L32 32.01c-17.67 0-32 14.31-32 32s14.33 32 32 32h16v320H32c-17.67 0-32 14.31-32 32s14.33 32 32 32h224c70.58 0 128-57.41 128-128C384 305.3 358.6 264.8 321.1 242.4zM112 96.01H224c35.3 0 64 28.72 64 64s-28.7 64-64 64H112V96.01zM256 416H112v-128H256c35.3 0 64 28.71 64 63.1S291.3 416 256 416z" />
          </svg>
        </div>
        <div
        class="highlightmenu-item"
          @click="toggleMark('italic')"
          :class="{
            'bg-border': hasMark.get('italic')
          }"
        >
          <!-- Italic -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            width="16"
            height="16"
            fill="var(--rlm-text-color, #333333)"
          >
            <path d="M384 56c0 13.25-10.75 24-24 24h-67.98l-146.9 352H232c13.25 0 24 10.75 24 24S245.3 480 232 480h-208C10.75 480 0 469.3 0 456s10.75-24 24-24h70.6l146.9-352H152C138.8 80 128 69.25 128 56S138.8 32 152 32h208C373.3 32 384 42.75 384 56z" />
          </svg>
        </div>
        <div
        class="highlightmenu-item"
          @click="toggleMark('underline')"
          :class="{
            'bg-border': hasMark.get('underline')
          }"
        >
          <!-- Underline -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="16"
            height="16"
            fill="var(--rlm-text-color, #333333)"
          >
            <path d="M40 48H64v192c0 88.22 71.78 160 160 160s160-71.78 160-160v-192h24c13.25 0 24-10.75 24-24S421.3 0 408 0h-96C298.8 0 288 10.75 288 24s10.75 24 24 24h24v192c0 61.75-50.25 112-112 112S112 301.8 112 240v-192h24C149.3 48 160 37.25 160 24S149.3 0 136 0h-96C26.75 0 16 10.75 16 24S26.75 48 40 48zM424 464H24C10.75 464 0 474.8 0 488S10.75 512 24 512h400c13.25 0 24-10.75 24-24S437.3 464 424 464z" />
          </svg>
        </div>
        <div
        class="highlightmenu-item"
            @click="toggleMark('strike')"
            :class="{
                'bg-border': hasMark.get('strike')
            }"
        >
          <!-- Strike -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="16"
            height="16"
            fill="var(--rlm-text-color, #333333)"
          >
            <path d="M488 239.9L287.2 240c-8.262-2.459-42.31-12.21-42.31-12.21C161.5 203.7 138.4 182.8 146.2 138.5c9.719-55.4 81.72-64.51 140.5-55.43c16.77 2.564 36.75 7.908 62.84 16.8c12.69 4.344 26.62-2.299 31.03-14.82c4.414-12.53-2.336-26.21-15.06-30.54c-28.93-9.861-51.58-15.86-71.29-18.89C189.7 19.57 110.9 57.61 98.15 130.3C88.41 185.7 113 218.8 146.5 240L24 239.9c-13.25 0-24 10.75-24 23.1s10.75 23.1 24 23.1h464c13.25 0 24-10.75 24-23.1S501.3 239.9 488 239.9zM361.7 336c5.1 10.26 6.734 22.25 4.059 37.47c-9.719 55.38-81.69 64.48-140.7 55.42c-25.89-3.83-56.08-14.53-82.72-23.97L128.6 400.1c-12.72-4.438-26.63 2.111-31.14 14.61c-4.494 12.5 2.16 26.22 14.85 30.64l13.47 4.75c28.76 10.19 61.36 21.75 91.86 26.27C233.6 478.8 249 480 263.7 480c81.09 0 139.3-36.74 150.1-98.34c3.047-17.35 2.619-32.35-.2246-45.66H361.7z" />
          </svg>
        </div>
        <div
        class="highlightmenu-item"
            @click="toggleMark('code')"
            :class="{
                'bg-border': hasMark.get('code')
            }"
        >
          <!-- Code -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            width="16"
            height="16"
            fill="var(--rlm-text-color, #333333)"
          >
            <path d="M58.76 256L216.6 406.6C226.2 415.8 226.5 430.1 217.4 440.6C208.2 450.2 193 450.5 183.4 441.4L7.428 273.4C2.684 268.8 0 262.6 0 256C0 249.4 2.684 243.2 7.428 238.6L183.4 70.64C193 61.49 208.2 61.84 217.4 71.43C226.5 81.02 226.2 96.21 216.6 105.4L58.76 256zM359.4 105.4C349.8 96.21 349.5 81.02 358.6 71.43C367.8 61.84 382.1 61.49 392.6 70.64L568.6 238.6C573.3 243.2 576 249.4 576 256C576 262.6 573.3 268.8 568.6 273.4L392.6 441.4C382.1 450.5 367.8 450.2 358.6 440.6C349.5 430.1 349.8 415.8 359.4 406.6L517.2 256L359.4 105.4z" />
          </svg>
        </div>
        <div
        class="highlightmenu-item"
            @click="toggleMark('hyperlink')"
            :class="{
                'bg-border': hasMark.get('hyperlink')
            }"
        >
          <!-- Hyperlink -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            width="16"
            height="16"
            fill="var(--rlm-text-color, #333333)"
          >
            <path d="M0 256C0 167.6 71.63 96 160 96H264C277.3 96 288 106.7 288 120C288 133.3 277.3 144 264 144H160C98.14 144 48 194.1 48 256C48 317.9 98.14 368 160 368H264C277.3 368 288 378.7 288 392C288 405.3 277.3 416 264 416H160C71.63 416 0 344.4 0 256zM480 416H376C362.7 416 352 405.3 352 392C352 378.7 362.7 368 376 368H480C541.9 368 592 317.9 592 256C592 194.1 541.9 144 480 144H376C362.7 144 352 133.3 352 120C352 106.7 362.7 96 376 96H480C568.4 96 640 167.6 640 256C640 344.4 568.4 416 480 416zM424 232C437.3 232 448 242.7 448 256C448 269.3 437.3 280 424 280H216C202.7 280 192 269.3 192 256C192 242.7 202.7 232 216 232H424z" />
          </svg>
        </div>
        <div 
        class="highlightmenu-item"
            @click="toggleMark('comment')"
            :class="{
                'bg-border': hasMark.get('comment')
            }"
        >
          <!-- Comment -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="16"
            height="16"
            fill="var(--rlm-text-color, #333333)"
          >
            <path d="M264 272h-112C138.8 272 128 282.8 128 296S138.8 320 152 320h112C277.3 320 288 309.3 288 296S277.3 272 264 272zM360 176h-208C138.8 176 128 186.8 128 200S138.8 224 152 224h208C373.3 224 384 213.3 384 200S373.3 176 360 176zM256 31.1c-141.4 0-255.1 93.13-255.1 208c0 47.62 19.91 91.25 52.91 126.3c-14.87 39.5-45.87 72.88-46.37 73.25c-6.623 7-8.373 17.25-4.623 26C5.816 474.3 14.38 480 24 480c61.49 0 109.1-25.75 139.1-46.25c28.87 9 60.16 14.25 92.9 14.25c141.4 0 255.1-93.13 255.1-207.1S397.4 31.1 256 31.1zM256 400c-26.75 0-53.12-4.125-78.36-12.12l-22.75-7.125L135.4 394.5c-14.25 10.12-33.87 21.38-57.49 29c7.373-12.12 14.37-25.75 19.87-40.25l10.62-28l-20.62-21.88C69.81 314.1 48.06 282.3 48.06 240c0-88.25 93.24-160 207.1-160c114.7 0 207.1 71.75 207.1 160S370.8 400 256 400z" />
          </svg>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { view } from "../document/prosemirror/render"
import schema from "../document/prosemirror/schema";
import { toggleMark } from "prosemirror-commands"

export default defineComponent({
    name: "HighlightMenu",
    props: {
        contextmenu: {
            type: Object,
            required: true,
        }
    },
    computed: {
        hasMark: function() {
            return new Map(['strong', 'italic', 'underline', 'strike', 'code', 'hyperlink'].map((mark: string) => {
                return [
                    mark, 
                    view.state.doc.rangeHasMark(
                        this.contextmenu.from,
                        this.contextmenu.to,
                        schema.marks[mark]
                    )
                ]
            }))
        },
        linkvalue: function() {
          if(this.hasMark.get("hyperlink")) {
                const value = view.state.selection.$head
                .marks()
                .find((mark) => mark.type.name == "hyperlink");
                if(value) return value.attrs.href;
            } else {
              return "";
            }
        }
    },
    methods: {
        toggleMark: function(mark: string) {
          toggleMark(schema.marks[mark])(view.state, view.dispatch, view);
        },
        implementLink: function() {
            const tr = view.state.tr.addMark(this.contextmenu.from, this.contextmenu.to, schema.marks["hyperlink"].create({ href: this.linkvalue}));
            view.dispatch(tr);
        }
    },
})
</script>

<style>

.highlightmenu-item {
    @apply p-2 cursor-pointer;
}

.highlightmenu-item:hover {
    background-color: theme(colors.border);
}

</style>