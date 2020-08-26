import productMixin from '@/mixins/productMixin';

export default {
  props: {
    lineItem: {
      type: Object,
      required: true,
    },
    extended: {
      type: Boolean,
      default: () => true,
    },
  },
  mixins: [productMixin],
};
