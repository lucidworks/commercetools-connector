/* eslint-disable */
import gql from "graphql-tag";
import LoadingSpinner from "../../common/LoadingSpinner/index.vue";
import ProductThumbnail from "../../common/ProductThumbnail/index.vue";
import ProductSortSelector from "../ProductSortSelector/index.vue";
import ProductFilter from "../ProductFilter/ProductFilter.vue";
import Pagination from "../../common/Pagination/index.vue";
import { products, onlyLastRequestedPromise } from "../../../api";
import {
  toPrice,
  pushPage,
  locale,
  modifyQuery,
  changeRoute,
} from "../../common/shared";
import sunriseConfig from "../../../../sunrise.config";

const removeHiddenFacetFromQuery = (facets, component) => {
  const facetObject = facets.reduce(
    (result, { name, terms }) =>
      result.set(
        name,
        terms.map((t) => t.term)
      ),
    new Map()
  );
  const facetKeys = sunriseConfig.facetSearches.map(({ name }) => name);
  // see if facets are in query that are missing in facets
  const missing = Object.entries(component.$route.query)
    .map(([key, value]) => [key, [].concat(value)])
    .reduce(
      (result, [key, values]) => result.concat(values.map((v) => [key, v])),
      []
    )
    .filter(([key]) => facetKeys.includes(key))
    .filter(([key, value]) => !(facetObject.get(key) || []).includes(value));
  if (missing.length) {
    // remove the facets that are missing from query
    const query = missing.reduce(
      (result, [key, value]) => modifyQuery(key, value, result, false),
      component.$route.query
    );
    changeRoute(
      {
        ...component.$route,
        query,
      },
      component,
      false
    );
  }
};

const last = onlyLastRequestedPromise("products");
const getProducts = (component) => {
  const category =
    component.$route.params.categorySlug === "all"
      ? undefined
      : component.categories?.results[0]?.id;
  if (!category && component.$route.params.categorySlug !== "all") {
    return;
  }
  component.loadingProducts = true;
  component.loadingFacets = true;

  const route = component.$route;
  const { currency, country } = component.$store.state;
  const loc = locale(component);
  const sortValue = route.query.sort;
  const searchText = route.query.q ? { [`text.${loc}`]: route.query.q } : {};
  const sort = sortValue
    ? { sort: `lastModifiedAt ${sortValue === "newest" ? "desc" : "asc"}` }
    : {};
  last(
    products.get({
      category,
      page: Number(route.params?.page || 1),
      pageSize: component.limit,
      ...sort,
      ...searchText,
    })
  ).then(({ facets, results, ...meta }) => {
    let faceLabels = [
      { variant: "variants.attributes.size_s", label: "Size", name: "size" },
      {
        variant: "variants.attributes.designer_s",
        label: "Designer",
        name: "designer",
      },
      { variant: "variants.attributes.color_s", label: "Color", name: "color" },
    ];
    let filteredFacets = [];

    facets.map((facet, i) => {
      filteredFacets.push({
        name: faceLabels[i].name,
        label: faceLabels[i].label,
        terms: facet[faceLabels[i].variant].terms,
      });
    });

    removeHiddenFacetFromQuery(filteredFacets, component);
    component.products = {
      ...meta,
      results: results.map(
        ({ id, masterVariant: { sku, images, prices }, name, slug }) => ({
          id,
          masterData: {
            current: {
              name: name[loc],
              slug: slug[loc],
              masterVariant: {
                sku,
                images,
                price: toPrice(prices, {
                  country,
                  currency,
                  // @todo: what about customerGroup and channel
                }),
              },
            },
          },
        })
      ),
    };

    component.facets = filteredFacets;
    component.loadingProducts = false;
    component.loadingFacets = false;
  });
};
export default {
  props: ["categorySlug", "page"],
  components: {
    LoadingSpinner,
    ProductThumbnail,
    ProductSortSelector,
    Pagination,
    ProductFilter,
  },
  data: () => ({
    categories: null,
    products: null,
    facets: null,
    sort: null,
    limit: Number(process.env.VUE_APP_PAGE_SIZE || 75),
    loadingProducts: false,
    loadingFacets: false,
    show: false,
    facetFilter: {},
    allChannels: false,
  }),
  computed: {
    category() {
      return this.categories.results[0];
    },
    hasManyProducts() {
      return this.products?.results.length >= this.limit / 2;
    },
    offset() {
      return (this.page - 1) * this.limit;
    },
    totalProducts() {
      return this.products.total;
    },
    isLoading() {
      return this.loadingProducts || this.$apollo.loading;
    },
  },
  methods: {
    showFacetFilter(facet) {
      return facet?.terms?.length > 32 || this.facetFilter[facet.name];
    },
    changeSort(sort) {
      this.sort = sort;
    },
    facetFilterChange({ name, value }) {
      this.facetFilter = { ...this.facetFilter, [name]: value };
    },
    channelChange(value) {
      this.allChannels = value;
    },
    changePage(page) {
      pushPage(page, this, "products");
    },
    showScroll(el) {
      // eslint-disable-next-line no-param-reassign
      el.style.display =
        window.innerHeight > 300 && window.scrollY > 200 ? "" : "none";
    },
    toggleFilter() {
      this.show = !this.show;
    },
  },
  apollo: {
    categories: {
      query: gql`
        query categories($where: String) {
          categories(where: $where, limit: 1) {
            results {
              id
            }
          }
        }
      `,
      variables() {
        return {
          where: `slug(${locale(this)}="${this.categorySlug}")`,
        };
      },
      skip: (vm) => !vm.categorySlug,
    },
  },
  watch: {
    $route() {
      getProducts(this);
    },
    categories() {
      getProducts(this);
    },
  },
};
