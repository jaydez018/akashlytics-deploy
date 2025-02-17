import { useQuery } from "react-query";
import { QueryKeys } from "./queryKeys";
import axios from "axios";
import { ApiUrlService } from "../shared/utils/apiUtils";
import { useSettings } from "../context/SettingsProvider";
import { providerStatusToDto } from "../shared/utils/providerUtils";

async function getProviders(apiEndpoint) {
  const response = await axios.get(ApiUrlService.providers(apiEndpoint));

  return response.data.providers;
}

export function useProviders(options) {
  const { settings } = useSettings();
  return useQuery(QueryKeys.getProvidersKey(), () => getProviders(settings.apiEndpoint), {
    ...options,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });
}

async function getProviderStatus(providerUri) {
  const response = await window.electron.queryProvider(`${providerUri}/status`, "GET");
  return providerStatusToDto(response);
}

export function useProviderStatus(providerUri, options) {
  return useQuery(QueryKeys.getProviderStatusKey(providerUri), () => getProviderStatus(providerUri), options);
}
