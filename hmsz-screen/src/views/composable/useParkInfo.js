import { ref } from "vue";
import { getParkInfoAPI } from "@/apis/park";

//园区概况
export function useParkInfo() {
    const parkInfo = ref({});
    const getParkInfo = async() => {
        const res = await getParkInfoAPI();
        parkInfo.value = res.data;
    };

    return {
        parkInfo,
        getParkInfo
    }
}