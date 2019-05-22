export default [
    { name: "getOrderList", method: "post", url: "/Home/IndexHome", prefix: "" }, // 获取可开票订单列表

    { name: "getOrderTitleList", method: "post", url: "/Nav/ListOrDetail", prefix: "" }, // 获取抬头发票列表

    { name: "saveFn", method: "post", url: "/Adv/AdvList", prefix: "" }, // 提交申请发票
]