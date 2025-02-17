if (typeof app === 'undefined') {
    var app = {};
}

if (app.baselineMigration == undefined) {
    app.baselineMigration = {};
}

(function (baselineMigration) {
    let helpers = app.onboard.helpers.get();

    //return;

    industryMap = [
        { name: "5ae9b28ac6b34c70e0af0c2f", value: "161,162,163" },
        { name: "5ae9b285c6b34c70e0af0c2d", value: "150" },
        { name: "5ae9b28fc6b34c70e0af0c35", value: "311,312,321,322" },
        { name: "5ae9b28cc6b34c70e0af0c32", value: "210,230,240" },
        { name: "5ae9b289c6b34c70e0af0c2e", value: "150" },
        { name: "5ae9b27ec6b34c70e0af0c2c", value: "150" },
        { name: "5ae9b28bc6b34c70e0af0c30", value: "170" },
        { name: "5ae9b28dc6b34c70e0af0c33", value: "220" },
        { name: "5ae9b28ec6b34c70e0af0c34", value: "311" },
        { name: "5ae9b28cc6b34c70e0af0c31", value: "2012,3821" },
        { name: "5ae9b4665116a20cac97e0a3", value: "9602" },
        { name: "5b2b69c9b958c00860588401", value: "9602" },
        { name: "5b2b69b9b958c00860588400", value: "9602" },
        { name: "5ae9b3f95116a20cac97e020", value: "4330" },
        { name: "5ae9b3f95116a20cac97e01f", value: "4321,4322,4329" },
        { name: "5ae9b3f85116a20cac97e01e", value: "4290" },
        { name: "5ae9b3fa5116a20cac97e021", value: "4390,7730" },
        { name: "5ae9b3f75116a20cac97e01d", value: "4312" },
        { name: "5ae9b4475116a20cac97e07e", value: "8542" },
        { name: "5ae9b4495116a20cac97e080", value: "8550" },
        { name: "5ae9b4445116a20cac97e07a", value: "8521" },
        { name: "5ae9b4455116a20cac97e07c", value: "8530" },
        { name: "5ae9b4485116a20cac97e07f", value: "8549" },
        { name: "5ae9b4415116a20cac97e077", value: "8510" },
        { name: "5ae9b4425116a20cac97e078", value: "8510" },
        { name: "5ae9b4435116a20cac97e079", value: "8510" },
        { name: "5ae9b4465116a20cac97e07d", value: "8541" },
        { name: "5ae9b4455116a20cac97e07b", value: "8522" },
        { name: "5ae9b3ef5116a20cac97e014", value: "3600" },
        { name: "5ae9b3ee5116a20cac97e012", value: "3520" },
        { name: "5ae9b3ed5116a20cac97e011", value: "3510" },
        { name: "5ae9b3ef5116a20cac97e013", value: "3530" },
        { name: "5ae9b4215116a20cac97e050", value: "6611,6612,6619" },
        { name: "5ae9b4225116a20cac97e051", value: "6621,6622,6629" },
        { name: "5ae9b4295116a20cac97e059", value: "7310,5811,5812,5813,5819,6010,6020" },
        { name: "5ae9b4285116a20cac97e058", value: "7110" },
        { name: "5ae9b42a5116a20cac97e05b", value: "7020,9411" },
        { name: "5ae9b42a5116a20cac97e05a", value: "7020" },
        { name: "5ae9b4205116a20cac97e04f", value: "6511,6512,6520,6530" },
        { name: "5ae9b4275116a20cac97e057", value: "6910,6920,7320,7020" },
        { name: "5ae9b41e5116a20cac97e04c", value: "6411,6419" },
        { name: "5ae9b41f5116a20cac97e04e", value: "6419" },
        { name: "5ae9b4245116a20cac97e053", value: "6820" },
        { name: "5ae9b4235116a20cac97e052", value: "6810" },
        { name: "5ae9b4255116a20cac97e055", value: "7730" },
        { name: "5ae9b4265116a20cac97e056", value: "7721,7722,7729" },
        { name: "5ae9b4245116a20cac97e054", value: "7710" },
        { name: "5ae9b3f25116a20cac97e017", value: "1920" },
        { name: "5ae9b3f55116a20cac97e01b", value: "6201,6209,6202" },
        { name: "5ae9b3f45116a20cac97e019", value: "3510" },
        { name: "5ae9b3f35116a20cac97e018", value: "7210,7490" },
        { name: "5ae9b3f15116a20cac97e016", value: "3520" },
        { name: "5ae9b3f45116a20cac97e01a", value: "3510" },
        { name: "5ae9b44d5116a20cac97e085", value: "8620" },
        { name: "5ae9b44a5116a20cac97e082", value: "8610" },
        { name: "5ae9b44b5116a20cac97e083", value: "8620" },
        { name: "5ae9b44c5116a20cac97e084", value: "8620" },
        { name: "5ae9b44e5116a20cac97e087", value: "8690" },
        { name: "5ae9b44e5116a20cac97e086", value: "8620" },
        { name: "5ae9b4525116a20cac97e08b", value: "8790" },
        { name: "5ae9b4545116a20cac97e08d", value: "8890" },
        { name: "5ae9b4505116a20cac97e089", value: "8720" },
        { name: "5ae9b4515116a20cac97e08a", value: "8730" },
        { name: "5ae9b44f5116a20cac97e088", value: "8710" },
        { name: "5ae9b4535116a20cac97e08c", value: "8810,8890" },
        { name: "5ae9b4545116a20cac97e08e", value: "7500" },
        { name: "5ae9b4125116a20cac97e03e", value: "5520" },
        { name: "5ae9b40d5116a20cac97e038", value: "5590" },
        { name: "5ae9b4135116a20cac97e03f", value: "5590" },
        { name: "5ae9b40e5116a20cac97e039", value: "5610,5629" },
        { name: "5ae9b4105116a20cac97e03b", value: "5510" },
        { name: "5ae9b40f5116a20cac97e03a", value: "5510" },
        { name: "5ae9b4115116a20cac97e03c", value: "5510" },
        { name: "5ae9b4125116a20cac97e03d", value: "5510" },
        { name: "5ae9b4325116a20cac97e064", value: "6202" },
        { name: "5ae9b4315116a20cac97e063", value: "6201,6209" },
        { name: "5ae9b42e5116a20cac97e05f", value: "6311" },
        { name: "5ae9b42f5116a20cac97e060", value: "6311" },
        { name: "5ae9b42c5116a20cac97e05d", value: "6202" },
        { name: "5ae9b42f5116a20cac97e061", value: "9511,9512" },
        { name: "5ae9b4305116a20cac97e062", value: "6209" },
        { name: "5ae9b4335116a20cac97e065", value: "6209" },
        { name: "5ae9b42d5116a20cac97e05e", value: "6201" },
        { name: "5ae9b4335116a20cac97e066", value: "6312" },
        { name: "5ae9b3e65116a20cac97e009", value: "3011,3012" },
        { name: "5ae9b3d55116a20cac97dff3", value: "2431,2432" },
        { name: "5ae9b2a1c6b34c70e0af0c4b", value: "1410,1420" },
        { name: "5ae9b3dd5116a20cac97dffd", value: "2513,27200" },
        { name: "5ae9b3e85116a20cac97e00b", value: "3030" },
        { name: "5ae9b3cd5116a20cac97dfea", value: "2011,2012,2021,2029" },
        { name: "5ae9b3d35116a20cac97dff1", value: "24101,24102" },
        { name: "5ae9b3d45116a20cac97dff2", value: "24202" },
        { name: "5ae9b29cc6b34c70e0af0c45", value: "1102,1102,1103,1104" },
        { name: "5ae9b3e55116a20cac97e007", value: "2920" },
        { name: "5ae9b2a9c6b34c70e0af0c55", value: "1910" },
        { name: "5ae9b299c6b34c70e0af0c42", value: "1050" },
        { name: "5ae9b3de5116a20cac97dffe", value: "27400" },
        { name: "5ae9b3da5116a20cac97dffa", value: "27100" },
        { name: "5ae9b3db5116a20cac97dffb", value: "27100" },
        { name: "5ae9b3df5116a20cac97e000", value: "26100" },
        { name: "5ae9b2a3c6b34c70e0af0c4d", value: "1520" },
        { name: "5ae9b3ea5116a20cac97e00d", value: "3100" },
        { name: "5ae9b3d75116a20cac97dff6", value: "2819" },
        { name: "5ae9b3d15116a20cac97dfef", value: "2310" },
        { name: "5ae9b29ac6b34c70e0af0c43", value: "1061,1062,1071,1072,1074,1075,1080" },
        { name: "5ae9b3d95116a20cac97dff8", value: "27500" },
        { name: "5ae9b3dc5116a20cac97dffc", value: "25992" },
        { name: "5ae9b29fc6b34c70e0af0c49", value: "1391" },
        { name: "5ae9b3cf5116a20cac97dfec", value: "2030" },
        { name: "5ae9b3e15116a20cac97e003", value: "26510" },
        { name: "5ae9b3e45116a20cac97e006", value: "2910" },
        { name: "5ae9b3d25116a20cac97dff0", value: "2391,2392,2393,2394,2395,2396,2399" },
        { name: "5ae9b3da5116a20cac97dff9", value: "1702,1709,26200,2817" },
        { name: "5ae9b3e25116a20cac97e004", value: "26700,26800" },
        { name: "5ae9b3ce5116a20cac97dfeb", value: "2029" },
        { name: "5ae9b3de5116a20cac97dfff", value: "26100,27100,27200" },
        { name: "5ae9b3d65116a20cac97dff5", value: "2511" },
        { name: "5ae9b29bc6b34c70e0af0c44", value: "1010,1020,1040" },
        { name: "5ae9b29ec6b34c70e0af0c48", value: "1399" },
        { name: "5ae9b2a5c6b34c70e0af0c50", value: "1701,1702,1709" },
        { name: "5ae9b3e65116a20cac97e008", value: "2930" },
        { name: "5ae9b2a8c6b34c70e0af0c53", value: "21000" },
        { name: "5ae9b3d15116a20cac97dfee", value: "2013,2220" },
        { name: "5ae9b2a4c6b34c70e0af0c4f", value: "1621,1622,1623,1629" },
        { name: "5ae9b3e75116a20cac97e00a", value: "3020" },
        { name: "5ae9b3d05116a20cac97dfed", value: "2211,2219" },
        { name: "5ae9b3d85116a20cac97dff7", value: "2819" },
        { name: "5ae9b3d55116a20cac97dff4", value: "2511,2512,2513" },
        { name: "5ae9b3e15116a20cac97e002", value: "26300" },
        { name: "5ae9b3e05116a20cac97e001", value: "26300" },
        { name: "5ae9b29dc6b34c70e0af0c46", value: "1200" },
        { name: "5ae9b3e95116a20cac97e00c", value: "3091,3092,3099" },
        { name: "5ae9b3e35116a20cac97e005", value: "26520" },
        { name: "5ae9b2a0c6b34c70e0af0c4a", value: "1410" },
        { name: "5ae9b3ea5116a20cac97e00e", value: "3211,3212" },
        { name: "5ae9b3cc5116a20cac97dfe8", value: "1920" },
        { name: "5ae9b2a7c6b34c70e0af0c52", value: "1811,1812" },
        { name: "5ae9b3cc5116a20cac97dfe9", value: "3822" },
        { name: "5ae9b299c6b34c70e0af0c41", value: "1010,1020,1030,1040" },
        { name: "5ae9b2a6c6b34c70e0af0c51", value: "5811,5812,5813,5819,5820,5920" },
        { name: "5ae9b3eb5116a20cac97e00f", value: "27500,3830" },
        { name: "5ae9b2a8c6b34c70e0af0c54", value: "1820" },
        { name: "5ae9b2a3c6b34c70e0af0c4e", value: "1610" },
        { name: "5ae9b29ec6b34c70e0af0c47", value: "1311,1312,1313" },
        { name: "5ae9b2a2c6b34c70e0af0c4c", value: "1511,1512" },
        { name: "5ae9b4585116a20cac97e092", value: "9411,9412" },
        { name: "5ae9b4595116a20cac97e094", value: "9491,9492,9499" },
        { name: "5ae9b4585116a20cac97e093", value: "9420" },
        { name: "5ae9b291c6b34c70e0af0c38", value: "610,620" },
        { name: "5ae9b296c6b34c70e0af0c3e", value: "810,899,891" },
        { name: "5ae9b290c6b34c70e0af0c37", value: "510,520" },
        { name: "5ae9b295c6b34c70e0af0c3d", value: "899" },
        { name: "5ae9b292c6b34c70e0af0c39", value: "721" },
        { name: "5ae9b293c6b34c70e0af0c3a", value: "710" },
        { name: "5ae9b294c6b34c70e0af0c3b", value: "729" },
        { name: "5ae9b297c6b34c70e0af0c3f", value: "990" },
        { name: "5ae9b295c6b34c70e0af0c3c", value: "892,893" },
        { name: "5ae9b4565116a20cac97e090", value: "9609,9609" },
        { name: "5ae9b4685116a20cac97e0a6", value: "9603" },
        { name: "5ae9b4675116a20cac97e0a5", value: "9609" },

        // Check with Prec.
        { name: "5ae9b4695116a20cac97e0a7", value: "9609" },

        { name: "5ae9b46a5116a20cac97e0a8", value: "9601" },
        { name: "5ae9b41b5116a20cac97e049", value: "5310,5320" },
        { name: "5ae9b41c5116a20cac97e04a", value: "6110,6120,6130,6190" },
        { name: "5ae9b43e5116a20cac97e073", value: "8411" },
        { name: "5ae9b4405116a20cac97e075", value: "8411" },
        { name: "5ae9b43f5116a20cac97e074", value: "8412" },
        { name: "5ae9b4625116a20cac97e09e", value: "5630" },
        { name: "5ae9b4635116a20cac97e0a0", value: "9000" },
        { name: "5ae9b4605116a20cac97e09c", value: "5621" },
        { name: "5ae9b45e5116a20cac97e09a", value: "5610" },
        { name: "5ae9b45d5116a20cac97e098", value: "9101,9102,9103,9321" },
        { name: "5ae9b45b5116a20cac97e096", value: "5911,5912,5913,5914,5920,6010,6020" },
        { name: "5ae9b45c5116a20cac97e097", value: "6391" },
        { name: "5ae9b4615116a20cac97e09d", value: "5629" },
        { name: "5ae9b45f5116a20cac97e09b", value: "5610,5629" },
        { name: "5ae9b4625116a20cac97e09f", value: "7721" },
        { name: "5ae9b4645116a20cac97e0a1", value: "7722" },
        { name: "5ae9b45d5116a20cac97e099", value: "9311,9312,9319" },
        { name: "5ae9b40b5116a20cac97e035", value: "4520" },
        { name: "5ae9b40c5116a20cac97e036", value: "9521,9522,9523,9524,9529" },
        { name: "5ae9b4355116a20cac97e068", value: "7210" },
        { name: "5ae9b4365116a20cac97e069", value: "7220" },
        { name: "5ae9b4395116a20cac97e06d", value: "8030" },
        { name: "5ae9b4375116a20cac97e06b", value: "8010" },
        { name: "5ae9b4385116a20cac97e06c", value: "8020" },
        { name: "5ae9b43c5116a20cac97e071", value: "7990" },
        { name: "5ae9b43c5116a20cac97e070", value: "7912" },
        { name: "5ae9b43b5116a20cac97e06f", value: "7911" },
        { name: "5ae9b4195116a20cac97e046", value: "5110,5120" },
        { name: "5ae9b4185116a20cac97e045", value: "5021,5022" },
        { name: "5ae9b4165116a20cac97e042", value: "4921,4922,4923" },
        { name: "5ae9b4155116a20cac97e041", value: "4911,4912" },
        { name: "5ae9b4175116a20cac97e044", value: "5011,5012" },
        { name: "5ae9b41a5116a20cac97e047", value: "5210,5221,5222,5223,5224,5229" },
        { name: "5ae9b4165116a20cac97e043", value: "4930" },
        { name: "5afc27c9a6ed5b3478a8582b", value: "3811,3821" },
        { name: "5afc27e0a6ed5b3478a8582d", value: "3830" },
        { name: "5afc27e9a6ed5b3478a8582e", value: "39000" },
        { name: "5afc27b0a6ed5b3478a85829", value: "3700" },
        { name: "5afc27d6a6ed5b3478a8582c", value: "3812,3822" },
        { name: "5afc27bba6ed5b3478a8582a", value: "3600" },
        { name: "5ae9b4025116a20cac97e02a", value: "4711,4719" },
        { name: "5ae9b4035116a20cac97e02c", value: "4763" },
        { name: "5ae9b4015116a20cac97e029", value: "4661,4662,4663,4669" },
        { name: "5ae9b4095116a20cac97e033", value: "4550" },
        { name: "5ae9b4055116a20cac97e02e", value: "4761" },
        { name: "5ae9b4025116a20cac97e02b", value: "4711,4721,4722,4723" },
        { name: "5ae9b4045116a20cac97e02d", value: "4764" },
        { name: "5ae9b4065116a20cac97e02f", value: "4781,4789" },
        { name: "5ae9b4085116a20cac97e031", value: "4530" },
        { name: "5ae9b4075116a20cac97e030", value: "4510" },
        { name: "5ae9b4085116a20cac97e032", value: "4520,4540" },
        { name: "5ae9b3ff5116a20cac97e027", value: "4641" },
        { name: "5ae9b3fd5116a20cac97e024", value: "4620,4630" },
        { name: "5ae9b3fe5116a20cac97e025", value: "4649" },
        { name: "5ae9b4005116a20cac97e028", value: "4659" },
        { name: "5ae9b3fe5116a20cac97e026", value: "4669" },
        { name: "5ae9b3fc5116a20cac97e023", value: "4610" },

        { name: "5ae9b27ec6b34c70e0af0c2c", value: "1110" },
        { name: "5ae9b27ec6b34c70e0af0c2c", value: "1120" },
        { name: "5ae9b27ec6b34c70e0af0c2c", value: "1130" },
        { name: "5ae9b27ec6b34c70e0af0c2c", value: "1140" },
        { name: "5ae9b27ec6b34c70e0af0c2c", value: "1150" },
        { name: "5ae9b27ec6b34c70e0af0c2c", value: "1160" },
        { name: "5ae9b27ec6b34c70e0af0c2c", value: "1190" },
        { name: "5ae9b27ec6b34c70e0af0c2c", value: "1210" },
        { name: "5ae9b27ec6b34c70e0af0c2c", value: "1220" },
        { name: "5ae9b27ec6b34c70e0af0c2c", value: "1230" },
        { name: "5ae9b27ec6b34c70e0af0c2c", value: "1240" },
        { name: "5ae9b27ec6b34c70e0af0c2c", value: "1250" },
        { name: "5ae9b27ec6b34c70e0af0c2c", value: "1260" },
        { name: "5ae9b27ec6b34c70e0af0c2c", value: "1270" },
        { name: "5ae9b27ec6b34c70e0af0c2c", value: "1280" },
        { name: "5ae9b27ec6b34c70e0af0c2c", value: "1290" },
        { name: "5ae9b28bc6b34c70e0af0c30", value: "1300" },
        { name: "5ae9b285c6b34c70e0af0c2d", value: "1430" },
        { name: "5ae9b285c6b34c70e0af0c2d", value: "1440" },
        { name: "5ae9b285c6b34c70e0af0c2d", value: "1450" },
        { name: "5ae9b285c6b34c70e0af0c2d", value: "1460" },
        { name: "5ae9b285c6b34c70e0af0c2d", value: "1490" },
        { name: "5ae9b28bc6b34c70e0af0c30", value: "1640" },
        { name: "5ae9b296c6b34c70e0af0c3e", value: "7292" },
        { name: "5ae9b296c6b34c70e0af0c3e", value: "7293" },
        { name: "5ae9b296c6b34c70e0af0c3e", value: "7294" },
        { name: "5ae9b296c6b34c70e0af0c3e", value: "7295" },
        { name: "5ae9b294c6b34c70e0af0c3b", value: "7299" },
        { name: "5ae9b296c6b34c70e0af0c3e", value: "8102" },
        { name: "5ae9b295c6b34c70e0af0c3c", value: "8109" },
        { name: "5ae9b296c6b34c70e0af0c3e", value: "8919" },
        { name: "5ae9b296c6b34c70e0af0c3e", value: "8992" },
        { name: "5ae9b296c6b34c70e0af0c3e", value: "8999" },
        { name: "5ae9b291c6b34c70e0af0c38", value: "9100" },
        { name: "5ae9b296c6b34c70e0af0c3e", value: "9909" },
        { name: "5ae9b299c6b34c70e0af0c41", value: "10102" },
        { name: "5ae9b299c6b34c70e0af0c41", value: "10103" },
        { name: "5ae9b299c6b34c70e0af0c41", value: "10109" },
        { name: "5ae9b299c6b34c70e0af0c41", value: "10402" },
        { name: "5ae9b299c6b34c70e0af0c41", value: "10502" },
        { name: "5ae9b299c6b34c70e0af0c41", value: "10503" },
        { name: "5ae9b299c6b34c70e0af0c41", value: "10504" },
        { name: "5ae9b299c6b34c70e0af0c41", value: "10612" },
        { name: "5ae9b299c6b34c70e0af0c41", value: "10730" },
        { name: "5ae9b299c6b34c70e0af0c41", value: "10791" },
        { name: "5ae9b299c6b34c70e0af0c41", value: "10792" },
        { name: "5ae9b299c6b34c70e0af0c41", value: "10799" },
        { name: "5ae9b29cc6b34c70e0af0c45", value: "11010" },
        { name: "5ae9b29cc6b34c70e0af0c45", value: "11032" },
        { name: "5ae9b29cc6b34c70e0af0c45", value: "11033" },
        { name: "5ae9b299c6b34c70e0af0c41", value: "13112" },
        { name: "5ae9b29ec6b34c70e0af0c48", value: "13119" },
        { name: "5ae9b3cf5116a20cac97dfec", value: "13921" },
        { name: "5ae9b3cf5116a20cac97dfec", value: "13922" },
        { name: "5ae9b3cf5116a20cac97dfec", value: "13930" },
        { name: "5ae9b3cf5116a20cac97dfec", value: "13940" },
        { name: "5ae9b3cf5116a20cac97dfec", value: "14100" },
        { name: "5ae9b2a0c6b34c70e0af0c4a", value: "14200" },
        { name: "5ae9b29fc6b34c70e0af0c49", value: "14300" },
        { name: "5ae9b2a3c6b34c70e0af0c4e", value: "16100" },
        { name: "5ae9b2a4c6b34c70e0af0c4f", value: "16292" },
        { name: "5ae9b2a5c6b34c70e0af0c50", value: "17022" },
        { name: "5ae9b3ce5116a20cac97dfeb", value: "20220" },
        { name: "5ae9b3ce5116a20cac97dfeb", value: "20230" },
        { name: "5ae9b3ce5116a20cac97dfeb", value: "20292" },
        { name: "5ae9b3cd5116a20cac97dfea", value: "20299" },
        { name: "5ae9b3d55116a20cac97dff3", value: "24201" },
        { name: "5ae9b3ea5116a20cac97e00e", value: "25119" },
        { name: "5ae9b3ea5116a20cac97e00e", value: "25200" },
        { name: "5ae9b3ea5116a20cac97e00e", value: "25910" },
        { name: "5ae9b3ea5116a20cac97e00e", value: "25921" },
        { name: "5ae9b4285116a20cac97e058", value: "25922" },
        { name: "5ae9b3d95116a20cac97dff8", value: "25930" },
        { name: "5ae9b3d95116a20cac97dff8", value: "25991" },
        { name: "5ae9b3d65116a20cac97dff5", value: "25993" },
        { name: "5ae9b3d65116a20cac97dff5", value: "25994" },
        { name: "5ae9b3d65116a20cac97dff5", value: "25999" },
        { name: "5ae9b3df5116a20cac97e000", value: "26400" },
        { name: "5ae9b3df5116a20cac97e000", value: "26600" },
        { name: "5ae9b3df5116a20cac97e000", value: "27310" },
        { name: "5ae9b3df5116a20cac97e000", value: "27320" },
        { name: "5ae9b3df5116a20cac97e000", value: "27330" },
        { name: "5ae9b3df5116a20cac97e000", value: "27900" },
        { name: "5ae9b3df5116a20cac97e000", value: "28110" },
        { name: "5ae9b3d55116a20cac97dff4", value: "28120" },
        { name: "5ae9b3df5116a20cac97e000", value: "28130" },
        { name: "5ae9b3df5116a20cac97e000", value: "28140" },
        { name: "5ae9b3df5116a20cac97e000", value: "28150" },
        { name: "5ae9b3de5116a20cac97dfff", value: "28160" },
        { name: "5ae9b3df5116a20cac97e000", value: "28180" },
        { name: "5ae9b3d85116a20cac97dff7", value: "28210" },
        { name: "5ae9b3d85116a20cac97dff7", value: "28220" },
        { name: "5ae9b3d85116a20cac97dff7", value: "28230" },
        { name: "5ae9b3d85116a20cac97dff7", value: "28240" },
        { name: "5ae9b3d85116a20cac97dff7", value: "28250" },
        { name: "5ae9b3d85116a20cac97dff7", value: "28260" },
        { name: "5ae9b3d85116a20cac97dff7", value: "28290" },
        { name: "5ae9b3e95116a20cac97e00c", value: "30400" },
        { name: "5ae9b3d85116a20cac97dff7", value: "32119" },
        { name: "5ae9b3d85116a20cac97dff7", value: "32200" },
        { name: "5ae9b3d85116a20cac97dff7", value: "32300" },
        { name: "5ae9b3d85116a20cac97dff7", value: "32400" },
        { name: "5ae9b2a8c6b34c70e0af0c53", value: "32500" },
        { name: "5ae9b3d85116a20cac97dff7", value: "32901" },
        { name: "5ae9b3d85116a20cac97dff7", value: "32909" },
        { name: "5ae9b40c5116a20cac97e036", value: "33110" },
        { name: "5ae9b40c5116a20cac97e036", value: "33120" },
        { name: "5ae9b40c5116a20cac97e036", value: "33130" },
        { name: "5ae9b40c5116a20cac97e036", value: "33140" },
        { name: "5ae9b40c5116a20cac97e036", value: "33150" },
        { name: "5ae9b40c5116a20cac97e036", value: "33190" },
        { name: "5ae9b40c5116a20cac97e036", value: "33200" },
        { name: "5ae9b3ed5116a20cac97e011", value: "35102" },
        { name: "5ae9b3ed5116a20cac97e011", value: "35103" },
        { name: "5ae9b3f85116a20cac97e01e", value: "41000" },
        { name: "5ae9b3f85116a20cac97e01e", value: "42100" },
        { name: "5ae9b3f85116a20cac97e01e", value: "42200" },
        { name: "5ae9b3fa5116a20cac97e021", value: "43110" },
        { name: "5ae9b3f95116a20cac97e01f", value: "43302" },
        { name: "5ae9b3f95116a20cac97e01f", value: "43309" },
        { name: "5ae9b3f85116a20cac97e01e", value: "43909" },
        { name: "5ae9b4075116a20cac97e030", value: "45102" },
        { name: "5ae9b4075116a20cac97e030", value: "45103" },
        { name: "5ae9b3fd5116a20cac97e024", value: "46302" },
        { name: "5ae9b3fd5116a20cac97e024", value: "46303" },
        { name: "5ae9b4005116a20cac97e028", value: "46492" },
        { name: "5ae9b4005116a20cac97e028", value: "46493" },
        { name: "5ae9b4015116a20cac97e029", value: "46499" },
        { name: "5ae9b4005116a20cac97e028", value: "46510" },
        { name: "5ae9b4005116a20cac97e028", value: "46520" },
        { name: "5ae9b4005116a20cac97e028", value: "46530" },
        { name: "5ae9b4015116a20cac97e029", value: "46629" },
        { name: "5ae9b4015116a20cac97e029", value: "46692" },
        { name: "5ae9b3fe5116a20cac97e026", value: "46699" },
        { name: "5ae9b4015116a20cac97e029", value: "46900" },
        { name: "5ae9b4025116a20cac97e02b", value: "47212" },
        { name: "5ae9b4025116a20cac97e02b", value: "47213" },
        { name: "5ae9b4025116a20cac97e02a", value: "47219" },
        { name: "5ae9b4025116a20cac97e02a", value: "47310" },
        { name: "5ae9b4035116a20cac97e02c", value: "47320" },
        { name: "5ae9b4035116a20cac97e02c", value: "47410" },
        { name: "5ae9b4035116a20cac97e02c", value: "47420" },
        { name: "5ae9b4035116a20cac97e02c", value: "47430" },
        { name: "5ae9b4035116a20cac97e02c", value: "47490" },
        { name: "5ae9b4035116a20cac97e02c", value: "47510" },
        { name: "5ae9b4035116a20cac97e02c", value: "47520" },
        { name: "5ae9b4035116a20cac97e02c", value: "47530" },
        { name: "5ae9b4035116a20cac97e02c", value: "47540" },
        { name: "5ae9b4035116a20cac97e02c", value: "47620" },
        { name: "5ae9b4035116a20cac97e02c", value: "47632" },
        { name: "5ae9b4035116a20cac97e02c", value: "47639" },
        { name: "5ae9b4025116a20cac97e02b", value: "47710" },
        { name: "5ae9b4055116a20cac97e02e", value: "47720" },
        { name: "5ae9b4055116a20cac97e02e", value: "47790" },
        { name: "5ae9b4165116a20cac97e042", value: "49222" },
        { name: "5ae9b4165116a20cac97e042", value: "49223" },
        { name: "5ae9b4165116a20cac97e042", value: "49229" },
        { name: "5ae9b4165116a20cac97e042", value: "52212" },
        { name: "5ae9b4165116a20cac97e042", value: "52219" },
        { name: "5ae9b4105116a20cac97e03b", value: "55102" },
        { name: "5ae9b4115116a20cac97e03c", value: "55103" },
        { name: "5ae9b4125116a20cac97e03d", value: "55109" },
        { name: "5ae9b40e5116a20cac97e039", value: "56109" },
        { name: "5ae9b40e5116a20cac97e039", value: "56290" },
        { name: "5ae9b4675116a20cac97e0a5", value: "63990" },
        { name: "5ae9b41f5116a20cac97e04e", value: "64200" },
        { name: "5ae9b41f5116a20cac97e04e", value: "64300" },
        { name: "5ae9b41f5116a20cac97e04e", value: "64910" },
        { name: "5ae9b41f5116a20cac97e04e", value: "64920" },
        { name: "5ae9b4215116a20cac97e050", value: "64990" },
        { name: "5ae9b4205116a20cac97e04f", value: "65122" },
        { name: "5ae9b4205116a20cac97e04f", value: "65123" },
        { name: "5ae9b4205116a20cac97e04f", value: "65129" },
        { name: "5ae9b4275116a20cac97e057", value: "66300" },
        { name: "5ae9b4275116a20cac97e057", value: "69202" },
        { name: "5ae9b4275116a20cac97e057", value: "69209" },
        { name: "5ae9b4275116a20cac97e057", value: "70100" },
        { name: "5ae9b4285116a20cac97e058", value: "71102" },
        { name: "5ae9b4285116a20cac97e058", value: "71103" },
        { name: "5ae9b4285116a20cac97e058", value: "71104" },
        { name: "5ae9b4285116a20cac97e058", value: "71105" },
        { name: "5ae9b4285116a20cac97e058", value: "71106" },
        { name: "5ae9b4285116a20cac97e058", value: "71109" },
        { name: "5ae9b4285116a20cac97e058", value: "71200" },
        { name: "5ae9b4285116a20cac97e058", value: "72100" },
        { name: "5ae9b42a5116a20cac97e05b", value: "74100" },
        { name: "5ae9b42a5116a20cac97e05b", value: "74200" },
        { name: "5ae9b4245116a20cac97e054", value: "77302" },
        { name: "5ae9b4245116a20cac97e054", value: "77303" },
        { name: "5ae9b4255116a20cac97e055", value: "77304" },
        { name: "5ae9b4255116a20cac97e055", value: "77305" },
        { name: "5ae9b4255116a20cac97e055", value: "77306" },
        { name: "5ae9b4255116a20cac97e055", value: "77309" },
        { name: "5ae9b4235116a20cac97e052", value: "77400" },
        { name: "5ae9b4585116a20cac97e092", value: "78100" },
        { name: "5ae9b4585116a20cac97e092", value: "78200" },
        { name: "5ae9b4585116a20cac97e092", value: "78300" },
        { name: "5ae9b4585116a20cac97e092", value: "81100" },
        { name: "5ae9b42a5116a20cac97e05b", value: "81210" },
        { name: "5ae9b42a5116a20cac97e05b", value: "81300" },
        { name: "5ae9b42a5116a20cac97e05b", value: "82110" },
        { name: "5ae9b42a5116a20cac97e05b", value: "82190" },
        { name: "5ae9b42a5116a20cac97e05b", value: "82200" },
        { name: "5ae9b4585116a20cac97e093", value: "82300" },
        { name: "5ae9b42a5116a20cac97e05b", value: "82910" },
        { name: "5ae9b4675116a20cac97e0a5", value: "82920" },
        { name: "5ae9b4675116a20cac97e0a5", value: "82990" },
        { name: "5ae9b43e5116a20cac97e073", value: "84112" },
        { name: "5ae9b43e5116a20cac97e073", value: "84113" },
        { name: "5ae9b43e5116a20cac97e073", value: "84122" },
        { name: "5ae9b43e5116a20cac97e073", value: "84123" },
        { name: "5ae9b43e5116a20cac97e073", value: "84131" },
        { name: "5ae9b43e5116a20cac97e073", value: "84132" },
        { name: "5ae9b43e5116a20cac97e073", value: "84133" },
        { name: "5ae9b43e5116a20cac97e073", value: "84140" },
        { name: "5ae9b43e5116a20cac97e073", value: "84210" },
        { name: "5ae9b43e5116a20cac97e073", value: "84220" },
        { name: "5ae9b4385116a20cac97e06c", value: "84231" },
        { name: "5ae9b4385116a20cac97e06c", value: "84232" },
        { name: "5ae9b4385116a20cac97e06c", value: "84233" },
        { name: "5ae9b4385116a20cac97e06c", value: "84300" },
        { name: "5ae9b4415116a20cac97e077", value: "85102" },
        { name: "5ae9b44d5116a20cac97e085", value: "86202" },
        { name: "5ae9b44b5116a20cac97e083", value: "86209" },
        { name: "5ae9b4635116a20cac97e0a0", value: "92000" },
        { name: "5ae9b4635116a20cac97e0a0", value: "93290" },
        { name: "5b2b69b9b958c00860588400", value: "96022" },
        { name: "5ae9b4585116a20cac97e092", value: "97000" },
        { name: "5ae9b40c5116a20cac97e036", value: "98100" },
        { name: "5ae9b40c5116a20cac97e036", value: "98200" },
        { name: "5ae9b4595116a20cac97e094", value: "99011" },
        { name: "5ae9b4595116a20cac97e094", value: "99012" },
        { name: "5ae9b4675116a20cac97e0a5", value: "99013" },
        { name: "5ae9b4585116a20cac97e092", value: "99014" }

    ];

    let financialInfoMap = {
        // What was your annual turnover?
        'annualturnover': 'select-annual-turnover',
        // Which bank do you have a business bank account with?
        'bank': 'select-business-account-bank',
        // Which type of business bank account / services do you use?
        'bankaccservices': 'bankaccservices',
        // Do you have any other business loans?
        'businessloans': 'input-any-other-business-loans',
        // Who is this loan from?
        'whoistheloanfrom': 'control-who-is-this-loan-from',
        // Do any of your business transactions go through your personal account(and vice versa)?
        'businesstxpersonalacc': 'input-any-business-transactions-through-personal-accounts',
        // Who do you bank with personally?
        'personalbank': 'select-who-do-you-bank-with-personally',
        // Do you have an electronic accounting system?
        'haselecaccsystems': 'input-has-electronic-accounting-system',
        // Which electronic accounting system do you have?
        'elecaccsystems': 'select-which-accounting-system-do-you-have',
        // Which other electronic accounting system do you have?
        'elecaccsystemother': 'input-acounting-system-other',
        // Do you use a payroll system to provide pay slips to your staff?
        'haspayroll': 'input-use-payroll-system-for-staff-payslips',
        // Which electronic payroll system do you have?
        'payrollsystems': 'select-which-electronic-payroll-system',
        // Which other payroll system do you have?
        'payrollsystemother': 'input-payroll-system-other',
        // Have you invested any of your own money in your business?
        'hasinvestedownmoney': 'input-has-invested-own-money',
        // Did your business make a profit over the last 6 months?
        'businessisprofitable': 'input-made-profit-over-last-6-months',
        // Do you have collateral?
        'businesshascolateral': 'select-type-of-collateral'
    };

    let employeesMap = {
        'numberoffulltimeemployees': 'input-number-of-permanent-employees',
        'numberoffulltimewomenemployees': 'input-number-of-permanent-female-employees',
        'numberoffulltimeemployeesunder35': 'input-number-of-permanent-youth-employees-under35',
        'numberofparttimeemployees': 'input-number-of-part-time-employees',
        'numberofparttimewomenemployees': 'input-number-of-part-time-female-employees',
        'numberofparttimeemployeesunder35': 'input-number-of-part-time-youth-employees-under35'
    };

    let ownersMap = {
        'numberofowners': 'input-total-number-of-owners',
        'southafricanownedpercentage': 'input-percent-ownership-by-south-africans',
        'nonsouthafricanownedpercentage': 'input-percent-non-south-african-citizens',
        'companyownedpercentage': 'input-percent-companies-organisations',
        'blackallownedpercentage': 'input-percent-black-coloured-indian-pdi',
        'blackownedpercentage': 'input-percent-black-south-africans-only',
        'womenownedpercentage': 'input-percent-women-women-any-race',
        'womenblackonlypercentage': 'input-percent-women-black-only',
        'disabledownedpercentage': 'input-percent-disabled-people',
        'youthownedpercentage': 'input-percent-youth-under-35'
    };

    function getIndustryObj(code) {
        let value = code.split(',');
        value = parseInt(value[0]);
        for(let i = 0, max = industrySectors_v7.length; i < max; i++) {
            let o = industrySectors_v7[i];
            if (value == o.Subclass || value == o.Class || value == o.GroupId || value == o.DivisionId) {
                return o;
            }
        }
        return null;
    }

    function getSicFromGuid(guid) {
        for(let i = 0, max = industryMap.length; i < max; i++) {
            let o = industryMap[i];
            if (guid == o.name) {
                return getIndustryObj(o.value);
            }
        };
        return null;
    }

    function getTitleGuid(vrec) {
        if (vrec['Gender'] == 'Male') {
            return '622605ca67e3cc13cf216096';
        } else if (vrec['Gender'] == 'Female') {
            if (vrec['MaritalStatus'] == 'Married') {
                return '622605ca67e3cc13cf216097';
            } else {
                return '622605ca67e3cc13cf216098';
            }
        }
    }

    function getRepCapacityGuid(value) {
        let arr = value.split(',');
        value = arr[0];
        switch (value) {
            case 'Director' :
                return '6226122fc3ac73094c399c47';

            case 'EmployeeOfOwner':
                return '6226122fc3ac73094c399c48';

            case 'Intermediary':
                return '6226122fc3ac73094c399c46';

            case 'Other':
                return '6226122fc3ac73094c399c4d';

            default :
                '';
        }
    }

    let loadMock = null;//{mock:true};

    let userId = null;

    let ownerId = null;

    let fs = {
        user : {},
        owner: {},
        applications : [],
        companies : []
    };

    function saveUser(cb) {
        if (fs.user.migrated == true) {
            cb();
        } else {
            let json = fs.user.data;
            let prop = json.propertiesJson;
            let vrec = json.verificationRecordJson;
            json.propertiesJson = JSON.stringify(prop);
            json.verificationRecordJson = JSON.stringify(vrec);
            app.wizard.service.saveUserProfile(json, (result) => {
                cb();
            }, loadMock);
        }
    }

    function saveOwner(cb) {
        if (fs.owner.migrated == true) {
            cb();
        } else {
            let json = fs.owner.data;
            let prop = json.propertiesJson;
            let vrec = json.verificationRecordJson;
            json.propertiesJson = JSON.stringify(prop);
            json.verificationRecordJson = JSON.stringify(vrec);
            app.wizard.service.saveOwnerProfile(json, (result) => {
                cb();
            }, loadMock);
        }
    }

    function saveCompanies(cb) {
        function save(counter) {
            let json = fs.companies[counter].company.data;
            let prop = json.propertiesJson;
            let vrec = json.verificationRecordJson;
            json.verificationRecordJson = vrec != null ? JSON.stringify(vrec) : null;
            json.propertiesJson = JSON.stringify(prop);
            json['ownerId'] = ownerId;
            if (fs.companies[counter].company.migrated == true) {
                if (++counter < fs.companies.length) {
                    save(counter);
                } else {
                    cb();
                }
            } else {
                app.wizard.service.saveCompanyProfile(json, (result) => {
                    if (++counter < fs.companies.length) {
                        save(counter);
                    } else {
                        cb();
                    }
                }, loadMock);
            }
        }
        save(0);
    }

    function saveApplications(cb) {
        let counter = fs.applications.length;
        fs.companies.forEach((company, index) => {
            company.applications.forEach((application, index) => {
                if (application.migrated == true) {
                    if (--counter == 0) {
                        cb();
                    }
                } else {
                    let json = application.data;
                    let prop = json.propertiesJson;
                    json.propertiesJson = JSON.stringify(prop);
                    json.matchCriteriaJson = JSON.stringify(json.matchCriteriaJson);

                    let payload = {
                        id : json.id,
                        matchCriteriaJson: json.matchCriteriaJson,
                        locked: json.locked,
                        status: json.status,
                        propertiesJson: json.propertiesJson,
                        userId: json.userId,
                        tenantId: json.tenantId,
                        smeCompanyId: json.smeCompanyId,
                        creationTime: json.created
                    };

                    app.wizard.service.saveApplication(payload, (result) => {
                        if (--counter == 0) {
                            cb();
                        }
                    }, loadMock);
                }
            },);
        });
    }

    function translateUser(cb) {
        let json = fs.user.data;
        if (typeof json.propertiesJson !== 'object') {
            if (json.propertiesJson != '') {
                json.propertiesJson = JSON.parse(json.propertiesJson);
            } else {
                json.propertiesJson = {};
            }
        }
        if (typeof json.verificationRecordJson !== 'object') {
            if (json.verificationRecordJson != '') {
                json.verificationRecordJson = JSON.parse(json.verificationRecordJson);
            }
        }
        let prop = json.propertiesJson;
        let vrec = json.verificationRecordJson;
        fs.user.migrated = prop.hasOwnProperty('migrated-to-baseline');
        if (fs.user.migrated == false) {
            let value = '';
            let guid = '';
            prop['migrated-to-baseline'] = true;
            value = getTitleGuid(vrec);
            prop['user-title'] = value;
            value = json['isOwner'];
            prop['is-business-owner'] = value == true ? 'Yes' : 'No';
            if (value == false) {
                value = json['representativeCapacity'];
                guid = getRepCapacityGuid(value);
                json['representativeCapacity'] = guid;
                if (guid == '6226122fc3ac73094c399c4d') {
                    let arr = value.split(',');
                    prop['user-profile-capacity-other'] = arr.length > 0 ? arr[1] : '';
                }
            }
        }
        cb();
    }

    function translateOwner(cb) {
        let json = fs.owner.data;
        if (typeof json.propertiesJson !== 'object') {
            if (json.propertiesJson != '') {
                json.propertiesJson = JSON.parse(json.propertiesJson);
            } else {
                json.propertiesJson = {};
            }
        }
        if (typeof json.verificationRecordJson !== 'object') {
            if (json.verificationRecordJson != '') {
                json.verificationRecordJson = JSON.parse(json.verificationRecordJson);
            }
        }
        let prop = json.propertiesJson;
        let vrec = json.verificationRecordJson;

        fs.owner.migrated = fs.user.migrated;//json.propertiesJson.hasOwnProperty('migrated-to-baseline');
        if (fs.owner.migrated == false) {
            let value = '';
            let guid = '';
            prop['migrated-to-baseline'] = true;
            guid = getTitleGuid(vrec);
            prop['owner-title'] = guid;
            prop['owner-is-married-in-cop'] = '';
            if (json['race'] == 'other') {
                json['race'] = '62271c13567e92380c27c3c2';
            }
        }
        cb();
    }

    function translateCompanies(cb) {
        let counter = fs.companies.length;
        fs.companies.forEach((company, index) => {
            let json = company.company.data;
            if (typeof json.propertiesJson !== 'object') {
                if (json.propertiesJson != '') {
                    json.propertiesJson = JSON.parse(json.propertiesJson);
                } else {
                    json.propertiesJson = {};
                }
            }
            let prop = json.propertiesJson;
            if (typeof json.verificationRecordJson !== 'object') {
                if (json.verificationRecordJson != '' && json.verificationRecordJson != null) {
                    json.verificationRecordJson = JSON.parse(json.verificationRecordJson);
                }
            }
            let vrec = json.verificationRecordJson;
            company.company.migrated = fs.user.migrated;//prop.hasOwnProperty('migrated-to-baseline');
            if (company.company.migrated == false) {
                prop['migrated-to-baseline'] = true;

                let address = json['registeredAddress'];
                let arr = address.split(',');
                address = '';
                if (arr.length < 6) {
                    address += ',';
                }
                arr.forEach((o, i) => {
                    address += (o + (i < (arr.length - 1) ? ',' : ''));
                });
                json['registeredAddress'] = address;
                if (json.verificationRecordJson != null && typeof json.verificationRecordJson === 'object') {
                    prop['taxReferenceNumber'] = vrec['taxNumber'];
                }
                prop['registered-for-uif'] = '';
                let o = getSicFromGuid(company.company.data.industries);
                if (o != null) {
                    o = app.common.sic.getSicData(
                        o.SectionId, o.DivisionId, o.GroupId, o.Subclass, "1234567890"
                    );
                    prop['select-sic-section'] = o.section.id;
                    prop['select-sic-division'] = o.division.id;
                    prop['select-sic-group'] = o.group.id;
                    prop['select-sic-class'] = o.subClass.sic;
                    prop['select-sic-sub-class'] = o.subClass.id;

                    prop['industry'] = {
                        'Guid' : o.subClass.id,
                        'Subclass' : o.subClass.sic
                    };
                    json.industries = o.subClass.id;
                }
            }
            if (--counter == 0) {
                cb();
            }
        });
    }

    function translateApplications(cb) {

// Old
// KarbonPay	    60d19618eac92464d407fb63 Change to other.
// Osidon	    60d19618eac92464d407fb64 Change to other.
// Payday	    60d19618eac92464d407fb65 Change to other.
// Payslip	    60d19618eac92464d407fb66 Change to other.
// Peopleplus    60d19618eac92464d407fb67 Change to other.

// Sage          60d19618eac92464d407fb68
// SimplePay	    60d19618eac92464d407fb69
// SMEasy	    60d19618eac92464d407fb6a
// Xero	        60d19618eac92464d407fb6b
// Other	        60d19618eac92464d407fb6c

// New
// Sage          60d19618eac92464d407fb68
// SimplePay	    60d19618eac92464d407fb69
// SMEasy	    60d19618eac92464d407fb6a
// Xero	        60d19618eac92464d407fb6b
// Other	        60d19618eac92464d407fb6c

        function translateFinancialInfo(mc) {
            let arr = [];
            for(const name in financialInfoMap) {

                let i = 0;
                for (i = 0, max = mc.length; i < max; i++) {
                    if (name == mc[i]['name']) {
                        break;
                    }
                }
                if (i < mc.length) {
                    let value = mc[i]['value'];
                    if (name == 'businesshascolateral') {
                        if (value == 'Yes') {
                            value = '634d590a4d550ff4a17bbeae';// Other for tenand id = 2.
                            arr.push({
                                'name': 'input-value-of-collateral',
                                'value': '0'
                            });
                            arr.push({
                                'name': 'input-type-of-collateral-other',
                                'value': 'Other'
                            });
                        } else {
                            value = '634d5744765726af72f9ab54';// No collateral for tenant id = 2.
                        }
                    } else if (name == 'payrollsystems') {
                        //value = '60d19618eac92464d407fb64';//TODO: DELETE WHEN DONE TESTING!!!
                        if (value == '60d19618eac92464d407fb63' || 
                            value == '60d19618eac92464d407fb64' ||
                            value == '60d19618eac92464d407fb65' ||
                            value == '60d19618eac92464d407fb66' ||
                            value == '60d19618eac92464d407fb67') {
                            value = '60d19618eac92464d407fb6c';
                            arr.push({
                                'name': 'input-payroll-system-other',
                                'value': 'Other'
                            });
                            value = '60d19618eac92464d407fb6c';
                        }
                    }
                    arr.push({
                        'name': financialInfoMap[name],
                        'value' : value
                    });
                    mc.splice(i, 1);
                } else {

                }
            }
            return arr;
        }

        function translateOwnership(mc) {
            let arr = [];
            let totalOwners = 0;
            for (const name in ownersMap) {

                let i = 0;
                for (i = 0, max = mc.length; i < max; i++) {
                    if (name == mc[i]['name']) {
                        break;
                    }
                }
                if (i < mc.length) {
                    if (name == 'numberofowners') {
                        totalOwners = parseInt(mc[i]['value']);
                    }
                    arr.push({
                        'name': ownersMap[name],
                        'value': mc[i]['value']
                    });
                    //mc.splice(i, 1);
                } else {

                }
            }
            arr.forEach((o, i) => {
                let name = o['name'];
                let value = parseInt(o['value']);
                switch (name) {
                    case 'input-percent-black-coloured-indian-pdi':
                    case 'input-percent-black-south-africans-only':
                    case 'input-percent-women-women-any-race':
                    case 'input-percent-women-black-only':
                    case 'input-percent-disabled-people':
                    case 'input-percent-youth-under-35':
                        value = (value * totalOwners) / 100;
                        o['value'] = Math.round(value);
                        break;
                }
            });


            return arr;
        }

        function translateEmployees(mc) {
            let arr = [];
            let totalEmployees = 0;
            for (const name in employeesMap) {

                let i = 0;
                for (i = 0, max = mc.length; i < max; i++) {
                    if (name == mc[i]['name']) {
                        break;
                    }
                }
                if (i < mc.length) {
                    if (employeesMap[name] == 'input-number-of-permanent-employees' ||
                        employeesMap[name] == 'input-number-of-part-time-employees') {
                        let value = parseInt(mc[i]['value']);
                        totalEmployees += value;
                    }
                    arr.push({
                        'name': employeesMap[name],
                        'value': mc[i]['value']
                    });
                    //mc.splice(i, 1);
                } else {

                }
            }
            arr.push({
                'name': 'input-total-number-of-employees',
                'value' : totalEmployees.toString()
            });
            return arr;
        }

        function translateCreditScore(mc) {
            for (let i = 0, max = mc.length; i < max; i++) {
                if (mc[i].name == 'doyouknowyourpersonalcreditscore') {
                    let value = mc[i].value;
                    mc.push({
                        'name': 'input-credit-score-declaration',
                        'value': value
                    });
                    mc.splice(i, 1);
                    break;
                }
            }
        }

        let counter = fs.applications.length;
        if (counter == 0) {
            cb();
        } else {
            fs.companies.forEach((company, index) => {
                company.applications.forEach((application, index) => {
                    let json = application.data;
                    if (typeof json.propertiesJson !== 'object' || json.propertiesJson == null) {
                        if (json.propertiesJson != '' && json.propertiesJson != null) {
                            json.propertiesJson = JSON.parse(json.propertiesJson);
                        } else {
                            json.propertiesJson = {};
                        }
                    }
                    let prop = json.propertiesJson;
                    application.migrated = fs.user.migrated;//prop.hasOwnProperty('migrated-to-baseline');
                    if (application.migrated == false) {
                        prop['migrated-to-baseline'] = true;
                        if (application.data.matchCriteriaJson != null && application.data.matchCriteriaJson != '') {
                            application.data.matchCriteriaJson = JSON.parse(application.data.matchCriteriaJson);

                            let arr = translateFinancialInfo(application.data.matchCriteriaJson);
                            application.data.matchCriteriaJson = application.data.matchCriteriaJson.concat(arr);

                            arr = translateOwnership(company.company.data.propertiesJson.matchCriteriaJson);
                            application.data.matchCriteriaJson = application.data.matchCriteriaJson.concat(arr);

                            arr = translateEmployees(company.company.data.propertiesJson.matchCriteriaJson);
                            application.data.matchCriteriaJson = application.data.matchCriteriaJson.concat(arr);

                            application.data.matchCriteriaJson.push({
                                name: 'select-company-profile-bee-level',
                                value: company.company.data.beeLevel
                            });

                            let date = helpers.formatDate(company.company.data.startedTradingDate);
                            application.data.matchCriteriaJson.push({
                                name: 'date-started-trading-date',
                                value: date
                            });

                            translateCreditScore(application.data.matchCriteriaJson);
                        }
                    }
                    // TODO:
                    if (--counter == 0) {
                        cb();
                    }
                });
            });
        }
    }

    function loadUser(cb) {
        app.wizard.service.loadUserProfile((result) => {
            fs.user = { data: result.data, migrated: false };
            cb();
        });
    }

    function loadOwner(cb) {
        app.wizard.service.loadOwnerProfile((result) => {
            fs.owner = { data: result.data, migrated: false };
            ownerId = result.data.id;
            userId = result.data.userId;
            cb();
        });
    }

    function loadCompanies(cb) {
        app.wizard.service.loadCompanies((result) => {
            result.data.forEach((company, index) => {
                fs.companies.push({
                    company: { data: company.smeCompany, migrated: false },
                    applications: []
                });
            });
            cb();
        });
    }

    function loadApplications(cb) {

        function addApplications(company, applications) {
            applications.forEach((application, index) => {
                if (company.company.data.id == application.application.smeCompanyId) {
                    fs.applications.push(
                        application.application
                    );
                    company.applications.push({
                        data: application.application,
                        migrated: false
                    });
                }
            });
        }

        app.wizard.service.loadAllApplications(userId, (result) => {
            // For each company we need 0 .. N applications.
            let applications = result.data.items;
            fs.companies.forEach((company, index) => {
                addApplications(fs.companies[index], applications);
            });
            cb();
        });
    }

    function doSaves(cb) {
        saveUser(() => {
            saveOwner(() => {
                saveCompanies(() => {
                    saveApplications(() => {
                        cb();
                    });
                });
            });
        });
    }

    function doTranslations(cb) {
        translateUser(() => {
            translateOwner(() => {
                translateCompanies(() => {
                    translateApplications(() => {
                        cb();
                    });
                });
            });
        });
    }

    function doLoads(cb) {
        loadUser(() => {
            loadOwner(() => {
                loadCompanies(() => {
                    loadApplications(() => {
                        cb();
                    });
                });
            });
        });
    }

    baselineMigration.doMigration = function(cb) {
        doLoads(() => {
            doTranslations(() => {
                doSaves(() => {
                    cb();
                });
            });
        });
    }

    //doMigration(() => {
    //    alert('Migration Complete');
    //});

})(app.baselineMigration);
