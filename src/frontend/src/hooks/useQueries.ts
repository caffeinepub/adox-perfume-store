import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product, ProductInput, ProductUpdate } from "../backend";
import { useActor } from "./useActor";

export function useProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      const products = await actor.getProducts();
      return products.sort((a, b) => Number(a.position) - Number(b.position));
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useSiteContent(key: string, defaultValue: string) {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["siteContent", key],
    queryFn: async () => {
      if (!actor) return defaultValue;
      const val = await actor.getSiteContent(key);
      return val ?? defaultValue;
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    placeholderData: defaultValue,
  });
}

export function useSetSiteContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      if (!actor)
        throw new Error("Actor not ready. Please wait a moment and try again.");
      await actor.setSiteContent(key, value);
    },
    onSuccess: (_data, { key }) => {
      queryClient.invalidateQueries({ queryKey: ["siteContent", key] });
      queryClient.refetchQueries({ queryKey: ["siteContent", key] });
    },
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProductInput) => {
      if (!actor)
        throw new Error("Actor not ready. Please wait a moment and try again.");
      return actor.createProduct(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.refetchQueries({ queryKey: ["products"] });
    },
  });
}

export function useEditProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (update: ProductUpdate) => {
      if (!actor)
        throw new Error("Actor not ready. Please wait a moment and try again.");
      return actor.editProduct(update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.refetchQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor)
        throw new Error("Actor not ready. Please wait a moment and try again.");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.refetchQueries({ queryKey: ["products"] });
    },
  });
}

export function useReorderProducts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: bigint[]) => {
      if (!actor)
        throw new Error("Actor not ready. Please wait a moment and try again.");
      return actor.reorderProducts(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.refetchQueries({ queryKey: ["products"] });
    },
  });
}
