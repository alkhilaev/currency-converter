<template>
  <div
    class="input"
    :class="{
      'input--filled': !!modelValue,
      'input--error': errors.length,
      'input--icon-left': $slots.iconBefore,
      'input--icon-right': $slots.iconAfter,
      'input--disabled': disabled,
      'input--focused': focused,
      'input--small': small,
      'input--black-theme': theme === 'black',
    }"
  >
    <span class="input__title" v-if="title">
      <span>{{ title }}</span>
      <span class="input__required" v-if="required">*</span>
    </span>
    <span class="input__container">
      <button
        class="input__action"
        type="button"
        v-if="$slots.iconBefore"
        :class="{ 'input__action--no-action': noAction }"
      >
        <slot name="iconBefore" />
      </button>
      <input
        :type="type"
        v-maska
        :data-maska="mask"
        :data-maska-tokens="maskTokens"
        :data-maska-reversed="maskReversed"
        :placeholder="placeholder"
        class="input__field"
        ref="input"
        :value="modelValue"
        @input="input"
        @focus="focus"
        @keyup.enter="$emit('enter', $event)"
        @blur="blur"
        :disabled="disabled"
        :inputmode="inputmode"
        :min="min"
        :max="max"
      />
      <template v-if="canCopy">
        <button v-if="valueCopied" class="input__action input__copy" type="button">
          <IconComponent name="check-line" category="system" />
        </button>
        <button v-else class="input__action input__copy" type="button" @click="copyValue">
          <IconComponent name="file-copy-line" category="document" />
        </button>
      </template>
      <button
        class="input__action"
        type="button"
        v-if="$slots.iconAfter"
        @click="$emit('action')"
        :class="{ 'input__action--no-action': noAction }"
      >
        <slot name="iconAfter" />
      </button>
    </span>
    <span v-if="subtitle" class="input__subtitle">{{ subtitle }}</span>
    <div v-if="errors && errors.length" class="input__errors">
      <pre v-for="(e, i) in errors" :key="i">{{ e }}</pre>
    </div>
  </div>
</template>

<script>
import { vMaska } from "maska";
import IconComponent from "~/components/IconComponent.vue";

export default {
  name: "InputComponent",
  components: { IconComponent },
  emits: ["update:model-value", "blur", "focus", "enter", "action"],
  props: {
    title: String,
    subtitle: String,
    mask: String,
    maskTokens: String,
    maskReversed: Boolean,
    theme: {
      type: String,
      default: "default",
    },
    type: {
      type: String,
      default() {
        return "text";
      },
    },
    numbersOnly: Boolean,
    placeholder: {
      type: [String, Number],
    },
    min: Number,
    max: Number,
    modelValue: [String, Number],
    errors: {
      type: Array,
      default() {
        return [];
      },
    },
    iconPosition: {
      type: String,
      validator(value) {
        return value === "left" || value === "right";
      },
    },
    disabled: Boolean,
    isPhone: Boolean,
    required: Boolean,
    inputmode: String,
    autofocus: Boolean, // фокус на инпуте при его инициализации
    noAction: Boolean, // для возможности добавления иконки, без возможности клика на нее
    canCopy: Boolean, // для возможности скопировать значение
    small: Boolean, //
  },
  data() {
    return {
      focused: false,
      valueCopied: false,
      copyTimeout: null,
    };
  },
  mounted() {
    if (this.autofocus) {
      this.$refs.input.focus();
    }
  },
  unmounted() {
    clearTimeout(this.copyTimeout);
  },
  methods: {
    input($event) {
      let value = $event.target.value;
      if (this.numbersOnly && value) {
        value = value ? parseFloat(value.replace(/[\s-()]/g, "")) : 0;
        if (this.min && value < this.min) {
          value = this.min;
        }
        if (this.max && value > this.max) {
          value = this.max;
        }
      }
      $event.target.value = value;
      this.$emit("update:model-value", value);
    },
    focus() {
      if (!this.modelValue && this.isPhone && this.mask) {
        this.$emit("update:model-value", " ");
      }
      this.focused = true;
      this.$emit("focus");
    },
    blur($event) {
      this.focused = false;
      this.$emit("blur", $event.target.value);
    },
    copyValue() {
      navigator.clipboard.writeText(this.modelValue);
      this.valueCopied = true;
      this.copyTimeout = setTimeout(() => {
        this.valueCopied = false;
      }, 3000);
    },
  },
  directives: { maska: vMaska },
};
</script>

<style lang="stylus">
.input {
  display inline-flex
  flex-direction column
  //gap 20px
  +below(1024px) {
    gap 8px
  }

  &--black-theme {

    //^[0]--focused& {
    //  & ^[0]__container {
    //    box-shadow none !important
    //  }
    //}

    & ^[0]__title {
      color var(--black) !important
    }

    & ^[0]__container {
      box-shadow none
      border-color var(--black)
    }

    & ^[0]__field {
      color var(--black-o5)
    }
  }

  &__container {
    display flex
    position relative
    box-sizing: border-box;
    border-radius: var(--big-radius)
    height 48px
    transition var(--transition)
    overflow hidden
    +below(1024px) {
      height 56px
      border-radius: 12px
    }

    //&:hover {
      //border-color var(--black)
    //}

    ^[0]--icon-left &, ^[0]--icon-right & {
      display flex
      gap 10px
      padding: 10px 20px
      align-items center

      +below(1024px) {
        padding: 10px 16px
      }
    }
  }

  &--focused& {
    & ^[0]__container {
      border-color: var(--main)
    }
  }

  &--error& {
    & ^[0]__container {
      border-color var(--red, #C10000);
    }

    & .icon svg path {
      fill var(--red)
    }

    &__field {
      color: var(--red);

      &::placeholder {
        color: var(--red);
      }
    }
  }

  &--error {
    & ^[0]__container {
      border-color var(--red, #C10000);
    }
  }

  &--disabled {
    & ^[0]__field {
      cursor no-drop
    }
  }

  &__title {
    color var(--white)
    font-size: 1.5rem;
    font-weight: 500;
    font-style: normal;
    line-height: normal;
    display flex
    gap 4px
    padding 10px
    +below(1024px) {
      font-size: 1rem
      padding-left: 16px
    }
  }

  &__subtitle {
    color: rgba(0, 0, 0, 0.60);
    text-align: center;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-top 10px

    +below(1024px) {
      margin-top: 0
    }
  }

  &__required {
    color var(--red)
  }

  &__error {
    font-weight: normal;
    font-size: 0.75rem;
    line-height: 20px;
    color: var(--red);
  }

  &__action {
    background none
    border none
    //width 60px
    height 100%
    display inline-flex
    align-items center
    justify-content center
    padding 20px 20px 20px 10px
    cursor pointer
    z-index 2

    ^[0]--icon-left &, ^[0]--icon-right & {
      padding: 0
      display contents
    }

    & .icon svg {
      width 24px
      height 24px

      +below(728px) {
        width 18px
        height 18px
      }
    }
  }

  &__action--no-action {
    pointer-events: none;
  }

  &__field {
    background var(--white)
    border 1px solid var(--main)
    border-radius 6px
    width 100%
    height 100%
    padding 10px
    outline none
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    +below(1024px) {
      font-size: 1rem
    }

    ^[0]--icon-left &, ^[0]--icon-right & {
      padding: 0
    }

    &::placeholder {
      color: var(--white-o5);
      font-size: 1.125rem;
    }
  }

  .icon {
    width 24px
    height 24px

    +below(728px) {
      width 18px
      height 18px
    }
  }

  &__errors {
    color: var(--red, #C10000);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    display grid
    grid-gap 5px
    //padding-left:20px
    margin-top: 8px

    +below(1024px) {
      margin-top: 0
    }

    & pre {
      white-space break-spaces
    }
  }

  &__copy {
    padding-left: 0
  }
}
</style>
