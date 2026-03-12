import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  // Mixin Components
  include MixinStorage();

  // Kept for upgrade compatibility with previous version (was used by MixinAuthorization)
  let accessControlState = AccessControl.initState();

  // Types
  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    image : ?Storage.ExternalBlob;
    position : Nat;
  };

  public type ProductInput = {
    name : Text;
    description : Text;
    price : Nat;
    image : ?Storage.ExternalBlob;
  };

  public type ProductUpdate = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    image : ?Storage.ExternalBlob;
  };

  // Position comparison
  module Product {
    public func compareByPosition(a : Product, b : Product) : Order.Order {
      Nat.compare(a.position, b.position);
    };
  };

  // State
  var nextProductId : Nat = 1;
  let products = Map.empty<Nat, Product>();
  let siteContent = Map.empty<Text, Text>();

  // Product Management
  public shared func createProduct(newProduct : ProductInput) : async Product {
    let id = nextProductId;
    nextProductId += 1;
    let product : Product = {
      id;
      name = newProduct.name;
      description = newProduct.description;
      price = newProduct.price;
      image = newProduct.image;
      position = products.size();
    };
    products.add(id, product);
    product;
  };

  public query func getProducts() : async [Product] {
    products.values().toArray().sort(Product.compareByPosition);
  };

  public query func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public shared func editProduct(update : ProductUpdate) : async () {
    switch (products.get(update.id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existing) {
        let updatedProduct : Product = {
          existing with
          name = update.name;
          description = update.description;
          price = update.price;
          image = update.image;
        };
        products.add(update.id, updatedProduct);
      };
    };
  };

  public shared func deleteProduct(id : Nat) : async () {
    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
  };

  public shared func reorderProducts(ids : [Nat]) : async () {
    let idIter = ids.values();
    for ((index, id) in idIter.enumerate()) {
      switch (products.get(id)) {
        case (null) { Runtime.trap("Product with ID " # id.toText() # " not found") };
        case (?product) {
          let updatedProduct = { product with position = index };
          products.add(id, updatedProduct);
        };
      };
    };
  };

  // Site Content Management
  public shared func setSiteContent(pagename : Text, content : Text) : async () {
    siteContent.add(pagename, content);
  };

  public query func getSiteContent(pagename : Text) : async ?Text {
    siteContent.get(pagename);
  };
};
