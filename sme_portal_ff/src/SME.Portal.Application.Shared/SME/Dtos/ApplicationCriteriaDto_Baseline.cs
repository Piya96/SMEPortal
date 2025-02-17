using SME.Portal.Common.Dto;
using SME.Portal.Company.Dtos;
using SME.Portal.List.Dtos;
using SME.Portal.SME.Dtos.Applications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Globalization;
using Newtonsoft.Json.Linq;

namespace SME.Portal.SME.Dtos
{
	public class IndustryLookup
	{
		public static string[,] lu = {
			{ "5ae9b28ac6b34c70e0af0c2f", "161,162,163" },
			{ "5ae9b285c6b34c70e0af0c2d", "150" },
			{ "5ae9b28fc6b34c70e0af0c35", "311,312,321,322" },
			{ "5ae9b28cc6b34c70e0af0c32", "210,230,240" },
			{ "5ae9b289c6b34c70e0af0c2e", "150" },
			{ "5ae9b27ec6b34c70e0af0c2c", "150" },
			{ "5ae9b28bc6b34c70e0af0c30", "170" },
			{ "5ae9b28dc6b34c70e0af0c33", "220" },
			{ "5ae9b28ec6b34c70e0af0c34", "311" },
			{ "5ae9b28cc6b34c70e0af0c31", "2012,3821" },
			{ "5ae9b4665116a20cac97e0a3", "9602" },
			{ "5b2b69c9b958c00860588401", "9602" },
			{ "5b2b69b9b958c00860588400", "9602" },
			{ "5ae9b3f95116a20cac97e020", "4330" },
			{ "5ae9b3f95116a20cac97e01f", "4321,4322,4329" },
			{ "5ae9b3f85116a20cac97e01e", "4290" },
			{ "5ae9b3fa5116a20cac97e021", "4390,7730" },
			{ "5ae9b3f75116a20cac97e01d", "4312" },
			{ "5ae9b4475116a20cac97e07e", "8542" },
			{ "5ae9b4495116a20cac97e080", "8550" },
			{ "5ae9b4445116a20cac97e07a", "8521" },
			{ "5ae9b4455116a20cac97e07c", "8530" },
			{ "5ae9b4485116a20cac97e07f", "8549" },
			{ "5ae9b4415116a20cac97e077", "8510" },
			{ "5ae9b4425116a20cac97e078", "8510" },
			{ "5ae9b4435116a20cac97e079", "8510" },
			{ "5ae9b4465116a20cac97e07d", "8541" },
			{ "5ae9b4455116a20cac97e07b", "8522" },
			{ "5ae9b3ef5116a20cac97e014", "3600" },
			{ "5ae9b3ee5116a20cac97e012", "3520" },
			{ "5ae9b3ed5116a20cac97e011", "3510" },
			{ "5ae9b3ef5116a20cac97e013", "3530" },
			{ "5ae9b4215116a20cac97e050", "6611,6612,6619" },
			{ "5ae9b4225116a20cac97e051", "6621,6622,6629" },
			{ "5ae9b4295116a20cac97e059", "7310,5811,5812,5813,5819,6010,6020" },
			{ "5ae9b4285116a20cac97e058", "7110" },
			{ "5ae9b42a5116a20cac97e05b", "7020,9411" },
			{ "5ae9b42a5116a20cac97e05a", "7020" },
			{ "5ae9b4205116a20cac97e04f", "6511,6512,6520,6530" },
			{ "5ae9b4275116a20cac97e057", "6910,6920,7320,7020" },
			{ "5ae9b41e5116a20cac97e04c", "6411,6419" },
			{ "5ae9b41f5116a20cac97e04e", "6419" },
			{ "5ae9b4245116a20cac97e053", "6820" },
			{ "5ae9b4235116a20cac97e052", "6810" },
			{ "5ae9b4255116a20cac97e055", "7730" },
			{ "5ae9b4265116a20cac97e056", "7721,7722,7729" },
			{ "5ae9b4245116a20cac97e054", "7710" },
			{ "5ae9b3f25116a20cac97e017", "1920" },
			{ "5ae9b3f55116a20cac97e01b", "6201,6209,6202" },
			{ "5ae9b3f45116a20cac97e019", "3510" },
			{ "5ae9b3f35116a20cac97e018", "7210,7490" },
			{ "5ae9b3f15116a20cac97e016", "3520" },
			{ "5ae9b3f45116a20cac97e01a", "3510" },
			{ "5ae9b44d5116a20cac97e085", "8620" },
			{ "5ae9b44a5116a20cac97e082", "8610" },
			{ "5ae9b44b5116a20cac97e083", "8620" },
			{ "5ae9b44c5116a20cac97e084", "8620" },
			{ "5ae9b44e5116a20cac97e087", "8690" },
			{ "5ae9b44e5116a20cac97e086", "8620" },
			{ "5ae9b4525116a20cac97e08b", "8790" },
			{ "5ae9b4545116a20cac97e08d", "8890" },
			{ "5ae9b4505116a20cac97e089", "8720" },
			{ "5ae9b4515116a20cac97e08a", "8730" },
			{ "5ae9b44f5116a20cac97e088", "8710" },
			{ "5ae9b4535116a20cac97e08c", "8810,8890" },
			{ "5ae9b4545116a20cac97e08e", "7500" },
			{ "5ae9b4125116a20cac97e03e", "5520" },
			{ "5ae9b40d5116a20cac97e038", "5590" },
			{ "5ae9b4135116a20cac97e03f", "5590" },
			{ "5ae9b40e5116a20cac97e039", "5610,5629" },
			{ "5ae9b4105116a20cac97e03b", "5510" },
			{ "5ae9b40f5116a20cac97e03a", "5510" },
			{ "5ae9b4115116a20cac97e03c", "5510" },
			{ "5ae9b4125116a20cac97e03d", "5510" },
			{ "5ae9b4325116a20cac97e064", "6202" },
			{ "5ae9b4315116a20cac97e063", "6201,6209" },
			{ "5ae9b42e5116a20cac97e05f", "6311" },
			{ "5ae9b42f5116a20cac97e060", "6311" },
			{ "5ae9b42c5116a20cac97e05d", "6202" },
			{ "5ae9b42f5116a20cac97e061", "9511,9512" },
			{ "5ae9b4305116a20cac97e062", "6209" },
			{ "5ae9b4335116a20cac97e065", "6209" },
			{ "5ae9b42d5116a20cac97e05e", "6201" },
			{ "5ae9b4335116a20cac97e066", "6312" },
			{ "5ae9b3e65116a20cac97e009", "3011,3012" },
			{ "5ae9b3d55116a20cac97dff3", "2431,2432" },
			{ "5ae9b2a1c6b34c70e0af0c4b", "1410,1420" },
			{ "5ae9b3dd5116a20cac97dffd", "2513,27200" },
			{ "5ae9b3e85116a20cac97e00b", "3030" },
			{ "5ae9b3cd5116a20cac97dfea", "2011,2012,2021,2029" },
			{ "5ae9b3d35116a20cac97dff1", "24101,24102" },
			{ "5ae9b3d45116a20cac97dff2", "24202" },
			{ "5ae9b29cc6b34c70e0af0c45", "1102,1102,1103,1104" },
			{ "5ae9b3e55116a20cac97e007", "2920" },
			{ "5ae9b2a9c6b34c70e0af0c55", "1910" },
			{ "5ae9b299c6b34c70e0af0c42", "1050" },
			{ "5ae9b3de5116a20cac97dffe", "27400" },
			{ "5ae9b3da5116a20cac97dffa", "27100" },
			{ "5ae9b3db5116a20cac97dffb", "27100" },
			{ "5ae9b3df5116a20cac97e000", "26100" },
			{ "5ae9b2a3c6b34c70e0af0c4d", "1520" },
			{ "5ae9b3ea5116a20cac97e00d", "3100" },
			{ "5ae9b3d75116a20cac97dff6", "2819" },
			{ "5ae9b3d15116a20cac97dfef", "2310" },
			{ "5ae9b29ac6b34c70e0af0c43", "1061,1062,1071,1072,1074,1075,1080" },
			{ "5ae9b3d95116a20cac97dff8", "27500" },
			{ "5ae9b3dc5116a20cac97dffc", "25992" },
			{ "5ae9b29fc6b34c70e0af0c49", "1391" },
			{ "5ae9b3cf5116a20cac97dfec", "2030" },
			{ "5ae9b3e15116a20cac97e003", "26510" },
			{ "5ae9b3e45116a20cac97e006", "2910" },
			{ "5ae9b3d25116a20cac97dff0", "2391,2392,2393,2394,2395,2396,2399" },
			{ "5ae9b3da5116a20cac97dff9", "1702,1709,26200,2817" },
			{ "5ae9b3e25116a20cac97e004", "26700,26800" },
			{ "5ae9b3ce5116a20cac97dfeb", "2029" },
			{ "5ae9b3de5116a20cac97dfff", "26100,27100,27200" },
			{ "5ae9b3d65116a20cac97dff5", "2511" },
			{ "5ae9b29bc6b34c70e0af0c44", "1010,1020,1040" },
			{ "5ae9b29ec6b34c70e0af0c48", "1399" },
			{ "5ae9b2a5c6b34c70e0af0c50", "1701,1702,1709" },
			{ "5ae9b3e65116a20cac97e008", "2930" },
			{ "5ae9b2a8c6b34c70e0af0c53", "21000" },
			{ "5ae9b3d15116a20cac97dfee", "2013,2220" },
			{ "5ae9b2a4c6b34c70e0af0c4f", "1621,1622,1623,1629" },
			{ "5ae9b3e75116a20cac97e00a", "3020" },
			{ "5ae9b3d05116a20cac97dfed", "2211,2219" },
			{ "5ae9b3d85116a20cac97dff7", "2819" },
			{ "5ae9b3d55116a20cac97dff4", "2511,2512,2513" },
			{ "5ae9b3e15116a20cac97e002", "26300" },
			{ "5ae9b3e05116a20cac97e001", "26300" },
			{ "5ae9b29dc6b34c70e0af0c46", "1200" },
			{ "5ae9b3e95116a20cac97e00c", "3091,3092,3099" },
			{ "5ae9b3e35116a20cac97e005", "26520" },
			{ "5ae9b2a0c6b34c70e0af0c4a", "1410" },
			{ "5ae9b3ea5116a20cac97e00e", "3211,3212" },
			{ "5ae9b3cc5116a20cac97dfe8", "1920" },
			{ "5ae9b2a7c6b34c70e0af0c52", "1811,1812" },
			{ "5ae9b3cc5116a20cac97dfe9", "3822" },
			{ "5ae9b299c6b34c70e0af0c41", "1010,1020,1030,1040" },
			{ "5ae9b2a6c6b34c70e0af0c51", "5811,5812,5813,5819,5820,5920" },
			{ "5ae9b3eb5116a20cac97e00f", "27500,3830" },
			{ "5ae9b2a8c6b34c70e0af0c54", "1820" },
			{ "5ae9b2a3c6b34c70e0af0c4e", "1610" },
			{ "5ae9b29ec6b34c70e0af0c47", "1311,1312,1313" },
			{ "5ae9b2a2c6b34c70e0af0c4c", "1511,1512" },
			{ "5ae9b4585116a20cac97e092", "9411,9412" },
			{ "5ae9b4595116a20cac97e094", "9491,9492,9499" },
			{ "5ae9b4585116a20cac97e093", "9420" },
			{ "5ae9b291c6b34c70e0af0c38", "610,620" },
			{ "5ae9b296c6b34c70e0af0c3e", "810,899,891" },
			{ "5ae9b290c6b34c70e0af0c37", "510,520" },
			{ "5ae9b295c6b34c70e0af0c3d", "899" },
			{ "5ae9b292c6b34c70e0af0c39", "721" },
			{ "5ae9b293c6b34c70e0af0c3a", "710" },
			{ "5ae9b294c6b34c70e0af0c3b", "729" },
			{ "5ae9b297c6b34c70e0af0c3f", "990" },
			{ "5ae9b295c6b34c70e0af0c3c", "892,893" },
			{ "5ae9b4565116a20cac97e090", "9609,9609" },
			{ "5ae9b4685116a20cac97e0a6", "9603" },
			{ "5ae9b4675116a20cac97e0a5", "9609" },
			// Check with Prec
			{ "5ae9b4695116a20cac97e0a7", "9609" },

			{ "5ae9b46a5116a20cac97e0a8", "9601" },
			{ "5ae9b41b5116a20cac97e049", "5310,5320" },
			{ "5ae9b41c5116a20cac97e04a", "6110,6120,6130,6190" },
			{ "5ae9b43e5116a20cac97e073", "8411" },
			{ "5ae9b4405116a20cac97e075", "8411" },
			{ "5ae9b43f5116a20cac97e074", "8412" },
			{ "5ae9b4625116a20cac97e09e", "5630" },
			{ "5ae9b4635116a20cac97e0a0", "9000" },
			{ "5ae9b4605116a20cac97e09c", "5621" },
			{ "5ae9b45e5116a20cac97e09a", "5610" },
			{ "5ae9b45d5116a20cac97e098", "9101,9102,9103,9321" },
			{ "5ae9b45b5116a20cac97e096", "5911,5912,5913,5914,5920,6010,6020" },
			{ "5ae9b45c5116a20cac97e097", "6391" },
			{ "5ae9b4615116a20cac97e09d", "5629" },
			{ "5ae9b45f5116a20cac97e09b", "5610,5629" },
			{ "5ae9b4625116a20cac97e09f", "7721" },
			{ "5ae9b4645116a20cac97e0a1", "7722" },
			{ "5ae9b45d5116a20cac97e099", "9311,9312,9319" },
			{ "5ae9b40b5116a20cac97e035", "4520" },
			{ "5ae9b40c5116a20cac97e036", "9521,9522,9523,9524,9529" },
			{ "5ae9b4355116a20cac97e068", "7210" },
			{ "5ae9b4365116a20cac97e069", "7220" },
			{ "5ae9b4395116a20cac97e06d", "8030" },
			{ "5ae9b4375116a20cac97e06b", "8010" },
			{ "5ae9b4385116a20cac97e06c", "8020" },
			{ "5ae9b43c5116a20cac97e071", "7990" },
			{ "5ae9b43c5116a20cac97e070", "7912" },
			{ "5ae9b43b5116a20cac97e06f", "7911" },
			{ "5ae9b4195116a20cac97e046", "5110,5120" },
			{ "5ae9b4185116a20cac97e045", "5021,5022" },
			{ "5ae9b4165116a20cac97e042", "4921,4922,4923" },
			{ "5ae9b4155116a20cac97e041", "4911,4912" },
			{ "5ae9b4175116a20cac97e044", "5011,5012" },
			{ "5ae9b41a5116a20cac97e047", "5210,5221,5222,5223,5224,5229" },
			{ "5ae9b4165116a20cac97e043", "4930" },
			{ "5afc27c9a6ed5b3478a8582b", "3811,3821" },
			{ "5afc27e0a6ed5b3478a8582d", "3830" },
			{ "5afc27e9a6ed5b3478a8582e", "39000" },
			{ "5afc27b0a6ed5b3478a85829", "3700" },
			{ "5afc27d6a6ed5b3478a8582c", "3812,3822" },
			{ "5afc27bba6ed5b3478a8582a", "3600" },
			{ "5ae9b4025116a20cac97e02a", "4711,4719" },
			{ "5ae9b4035116a20cac97e02c", "4763" },
			{ "5ae9b4015116a20cac97e029", "4661,4662,4663,4669" },
			{ "5ae9b4095116a20cac97e033", "4550" },
			{ "5ae9b4055116a20cac97e02e", "4761" },
			{ "5ae9b4025116a20cac97e02b", "4711,4721,4722,4723" },
			{ "5ae9b4045116a20cac97e02d", "4764" },
			{ "5ae9b4065116a20cac97e02f", "4781,4789" },
			{ "5ae9b4085116a20cac97e031", "4530" },
			{ "5ae9b4075116a20cac97e030", "4510" },
			{ "5ae9b4085116a20cac97e032", "4520,4540" },
			{ "5ae9b3ff5116a20cac97e027", "4641" },
			{ "5ae9b3fd5116a20cac97e024", "4620,4630" },
			{ "5ae9b3fe5116a20cac97e025", "4649" },
			{ "5ae9b4005116a20cac97e028", "4659" },
			{ "5ae9b3fe5116a20cac97e026", "4669" },
			{ "5ae9b3fc5116a20cac97e023", "4610" },

			{ "5ae9b27ec6b34c70e0af0c2c", "1110"},
			{ "5ae9b27ec6b34c70e0af0c2c", "1120"},
			{ "5ae9b27ec6b34c70e0af0c2c", "1130"},
			{ "5ae9b27ec6b34c70e0af0c2c", "1140"},
			{ "5ae9b27ec6b34c70e0af0c2c", "1150"},
			{ "5ae9b27ec6b34c70e0af0c2c", "1160"},
			{ "5ae9b27ec6b34c70e0af0c2c", "1190"},
			{ "5ae9b27ec6b34c70e0af0c2c", "1210"},
			{ "5ae9b27ec6b34c70e0af0c2c", "1220"},
			{ "5ae9b27ec6b34c70e0af0c2c", "1230"},
			{ "5ae9b27ec6b34c70e0af0c2c", "1240"},
			{ "5ae9b27ec6b34c70e0af0c2c", "1250"},
			{ "5ae9b27ec6b34c70e0af0c2c", "1260"},
			{ "5ae9b27ec6b34c70e0af0c2c", "1270"},
			{ "5ae9b27ec6b34c70e0af0c2c", "1280"},
			{ "5ae9b27ec6b34c70e0af0c2c", "1290"},
			{ "5ae9b28bc6b34c70e0af0c30", "1300"},
			{ "5ae9b285c6b34c70e0af0c2d", "1430"},
			{ "5ae9b285c6b34c70e0af0c2d", "1440"},
			{ "5ae9b285c6b34c70e0af0c2d", "1450"},
			{ "5ae9b285c6b34c70e0af0c2d", "1460"},
			{ "5ae9b285c6b34c70e0af0c2d", "1490"},
			{ "5ae9b28bc6b34c70e0af0c30", "1640"},
			{ "5ae9b296c6b34c70e0af0c3e", "7292"},
			{ "5ae9b296c6b34c70e0af0c3e", "7293"},
			{ "5ae9b296c6b34c70e0af0c3e", "7294"},
			{ "5ae9b296c6b34c70e0af0c3e", "7295"},
			{ "5ae9b294c6b34c70e0af0c3b", "7299"},
			{ "5ae9b296c6b34c70e0af0c3e", "8102"},
			{ "5ae9b295c6b34c70e0af0c3c", "8109"},
			{ "5ae9b296c6b34c70e0af0c3e", "8919"},
			{ "5ae9b296c6b34c70e0af0c3e", "8992"},
			{ "5ae9b296c6b34c70e0af0c3e", "8999"},
			{ "5ae9b291c6b34c70e0af0c38", "9100"},
			{ "5ae9b296c6b34c70e0af0c3e", "9909"},
			{ "5ae9b299c6b34c70e0af0c41", "10102" },
			{ "5ae9b299c6b34c70e0af0c41", "10103" },
			{ "5ae9b299c6b34c70e0af0c41", "10109" },
			{ "5ae9b299c6b34c70e0af0c41", "10402" },
			{ "5ae9b299c6b34c70e0af0c41", "10502" },
			{ "5ae9b299c6b34c70e0af0c41", "10503" },
			{ "5ae9b299c6b34c70e0af0c41", "10504" },
			{ "5ae9b299c6b34c70e0af0c41", "10612" },
			{ "5ae9b299c6b34c70e0af0c41", "10730" },
			{ "5ae9b299c6b34c70e0af0c41", "10791" },
			{ "5ae9b299c6b34c70e0af0c41", "10792" },
			{ "5ae9b299c6b34c70e0af0c41", "10799" },
			{ "5ae9b29cc6b34c70e0af0c45", "11010" },
			{ "5ae9b29cc6b34c70e0af0c45", "11032" },
			{ "5ae9b29cc6b34c70e0af0c45", "11033" },
			{ "5ae9b299c6b34c70e0af0c41", "13112" },
			{ "5ae9b29ec6b34c70e0af0c48", "13119" },
			{ "5ae9b3cf5116a20cac97dfec", "13921" },
			{ "5ae9b3cf5116a20cac97dfec", "13922" },
			{ "5ae9b3cf5116a20cac97dfec", "13930" },
			{ "5ae9b3cf5116a20cac97dfec", "13940" },
			{ "5ae9b3cf5116a20cac97dfec", "14100" },
			{ "5ae9b2a0c6b34c70e0af0c4a", "14200" },
			{ "5ae9b29fc6b34c70e0af0c49", "14300" },
			{ "5ae9b2a3c6b34c70e0af0c4e", "16100" },
			{ "5ae9b2a4c6b34c70e0af0c4f", "16292" },
			{ "5ae9b2a5c6b34c70e0af0c50", "17022" },
			{ "5ae9b3ce5116a20cac97dfeb", "20220" },
			{ "5ae9b3ce5116a20cac97dfeb", "20230" },
			{ "5ae9b3ce5116a20cac97dfeb", "20292" },
			{ "5ae9b3cd5116a20cac97dfea", "20299" },
			{ "5ae9b3d55116a20cac97dff3", "24201" },
			{ "5ae9b3ea5116a20cac97e00e", "25119" },
			{ "5ae9b3ea5116a20cac97e00e", "25200" },
			{ "5ae9b3ea5116a20cac97e00e", "25910" },
			{ "5ae9b3ea5116a20cac97e00e", "25921" },
			{ "5ae9b4285116a20cac97e058", "25922" },
			{ "5ae9b3d95116a20cac97dff8", "25930" },
			{ "5ae9b3d95116a20cac97dff8", "25991" },
			{ "5ae9b3d65116a20cac97dff5", "25993" },
			{ "5ae9b3d65116a20cac97dff5", "25994" },
			{ "5ae9b3d65116a20cac97dff5", "25999" },
			{ "5ae9b3df5116a20cac97e000", "26400" },
			{ "5ae9b3df5116a20cac97e000", "26600" },
			{ "5ae9b3df5116a20cac97e000", "27310" },
			{ "5ae9b3df5116a20cac97e000", "27320" },
			{ "5ae9b3df5116a20cac97e000", "27330" },
			{ "5ae9b3df5116a20cac97e000", "27900" },
			{ "5ae9b3df5116a20cac97e000", "28110" },
			{ "5ae9b3d55116a20cac97dff4", "28120" },
			{ "5ae9b3df5116a20cac97e000", "28130" },
			{ "5ae9b3df5116a20cac97e000", "28140" },
			{ "5ae9b3df5116a20cac97e000", "28150" },
			{ "5ae9b3de5116a20cac97dfff", "28160" },
			{ "5ae9b3df5116a20cac97e000", "28180" },
			{ "5ae9b3d85116a20cac97dff7", "28210" },
			{ "5ae9b3d85116a20cac97dff7", "28220" },
			{ "5ae9b3d85116a20cac97dff7", "28230" },
			{ "5ae9b3d85116a20cac97dff7", "28240" },
			{ "5ae9b3d85116a20cac97dff7", "28250" },
			{ "5ae9b3d85116a20cac97dff7", "28260" },
			{ "5ae9b3d85116a20cac97dff7", "28290" },
			{ "5ae9b3e95116a20cac97e00c", "30400" },
			{ "5ae9b3d85116a20cac97dff7", "32119" },
			{ "5ae9b3d85116a20cac97dff7", "32200" },
			{ "5ae9b3d85116a20cac97dff7", "32300" },
			{ "5ae9b3d85116a20cac97dff7", "32400" },
			{ "5ae9b2a8c6b34c70e0af0c53", "32500" },
			{ "5ae9b3d85116a20cac97dff7", "32901" },
			{ "5ae9b3d85116a20cac97dff7", "32909" },
			{ "5ae9b40c5116a20cac97e036", "33110" },
			{ "5ae9b40c5116a20cac97e036", "33120" },
			{ "5ae9b40c5116a20cac97e036", "33130" },
			{ "5ae9b40c5116a20cac97e036", "33140" },
			{ "5ae9b40c5116a20cac97e036", "33150" },
			{ "5ae9b40c5116a20cac97e036", "33190" },
			{ "5ae9b40c5116a20cac97e036", "33200" },
			{ "5ae9b3ed5116a20cac97e011", "35102" },
			{ "5ae9b3ed5116a20cac97e011", "35103" },
			{ "5ae9b3f85116a20cac97e01e", "41000" },
			{ "5ae9b3f85116a20cac97e01e", "42100" },
			{ "5ae9b3f85116a20cac97e01e", "42200" },
			{ "5ae9b3fa5116a20cac97e021", "43110" },
			{ "5ae9b3f95116a20cac97e01f", "43302" },
			{ "5ae9b3f95116a20cac97e01f", "43309" },
			{ "5ae9b3f85116a20cac97e01e", "43909" },
			{ "5ae9b4075116a20cac97e030", "45102" },
			{ "5ae9b4075116a20cac97e030", "45103" },
			{ "5ae9b3fd5116a20cac97e024", "46302" },
			{ "5ae9b3fd5116a20cac97e024", "46303" },
			{ "5ae9b4005116a20cac97e028", "46492" },
			{ "5ae9b4005116a20cac97e028", "46493" },
			{ "5ae9b4015116a20cac97e029", "46499" },
			{ "5ae9b4005116a20cac97e028", "46510" },
			{ "5ae9b4005116a20cac97e028", "46520" },
			{ "5ae9b4005116a20cac97e028", "46530" },
			{ "5ae9b4015116a20cac97e029", "46629" },
			{ "5ae9b4015116a20cac97e029", "46692" },
			{ "5ae9b3fe5116a20cac97e026", "46699" },
			{ "5ae9b4015116a20cac97e029", "46900" },
			{ "5ae9b4025116a20cac97e02b", "47212" },
			{ "5ae9b4025116a20cac97e02b", "47213" },
			{ "5ae9b4025116a20cac97e02a", "47219" },
			{ "5ae9b4025116a20cac97e02a", "47310" },
			{ "5ae9b4035116a20cac97e02c", "47320" },
			{ "5ae9b4035116a20cac97e02c", "47410" },
			{ "5ae9b4035116a20cac97e02c", "47420" },
			{ "5ae9b4035116a20cac97e02c", "47430" },
			{ "5ae9b4035116a20cac97e02c", "47490" },
			{ "5ae9b4035116a20cac97e02c", "47510" },
			{ "5ae9b4035116a20cac97e02c", "47520" },
			{ "5ae9b4035116a20cac97e02c", "47530" },
			{ "5ae9b4035116a20cac97e02c", "47540" },
			{ "5ae9b4035116a20cac97e02c", "47620" },
			{ "5ae9b4035116a20cac97e02c", "47632" },
			{ "5ae9b4035116a20cac97e02c", "47639" },
			{ "5ae9b4025116a20cac97e02b", "47710" },
			{ "5ae9b4055116a20cac97e02e", "47720" },
			{ "5ae9b4055116a20cac97e02e", "47790" },
			{ "5ae9b4165116a20cac97e042", "49222" },
			{ "5ae9b4165116a20cac97e042", "49223" },
			{ "5ae9b4165116a20cac97e042", "49229" },
			{ "5ae9b4165116a20cac97e042", "52212" },
			{ "5ae9b4165116a20cac97e042", "52219" },
			{ "5ae9b4105116a20cac97e03b", "55102" },
			{ "5ae9b4115116a20cac97e03c", "55103" },
			{ "5ae9b4125116a20cac97e03d", "55109" },
			{ "5ae9b40e5116a20cac97e039", "56109" },
			{ "5ae9b40e5116a20cac97e039", "56290" },
			{ "5ae9b4675116a20cac97e0a5", "63990" },
			{ "5ae9b41f5116a20cac97e04e", "64200" },
			{ "5ae9b41f5116a20cac97e04e", "64300" },
			{ "5ae9b41f5116a20cac97e04e", "64910" },
			{ "5ae9b41f5116a20cac97e04e", "64920" },
			{ "5ae9b4215116a20cac97e050", "64990" },
			{ "5ae9b4205116a20cac97e04f", "65122" },
			{ "5ae9b4205116a20cac97e04f", "65123" },
			{ "5ae9b4205116a20cac97e04f", "65129" },
			{ "5ae9b4275116a20cac97e057", "66300" },
			{ "5ae9b4275116a20cac97e057", "69202" },
			{ "5ae9b4275116a20cac97e057", "69209" },
			{ "5ae9b4275116a20cac97e057", "70100" },
			{ "5ae9b4285116a20cac97e058", "71102" },
			{ "5ae9b4285116a20cac97e058", "71103" },
			{ "5ae9b4285116a20cac97e058", "71104" },
			{ "5ae9b4285116a20cac97e058", "71105" },
			{ "5ae9b4285116a20cac97e058", "71106" },
			{ "5ae9b4285116a20cac97e058", "71109" },
			{ "5ae9b4285116a20cac97e058", "71200" },
			{ "5ae9b4285116a20cac97e058", "72100" },
			{ "5ae9b42a5116a20cac97e05b", "74100" },
			{ "5ae9b42a5116a20cac97e05b", "74200" },
			{ "5ae9b4245116a20cac97e054", "77302" },
			{ "5ae9b4245116a20cac97e054", "77303" },
			{ "5ae9b4255116a20cac97e055", "77304" },
			{ "5ae9b4255116a20cac97e055", "77305" },
			{ "5ae9b4255116a20cac97e055", "77306" },
			{ "5ae9b4255116a20cac97e055", "77309" },
			{ "5ae9b4235116a20cac97e052", "77400" },
			{ "5ae9b4585116a20cac97e092", "78100" },
			{ "5ae9b4585116a20cac97e092", "78200" },
			{ "5ae9b4585116a20cac97e092", "78300" },
			{ "5ae9b4585116a20cac97e092", "81100" },
			{ "5ae9b42a5116a20cac97e05b", "81210" },
			{ "5ae9b42a5116a20cac97e05b", "81300" },
			{ "5ae9b42a5116a20cac97e05b", "82110" },
			{ "5ae9b42a5116a20cac97e05b", "82190" },
			{ "5ae9b42a5116a20cac97e05b", "82200" },
			{ "5ae9b4585116a20cac97e093", "82300" },
			{ "5ae9b42a5116a20cac97e05b", "82910" },
			{ "5ae9b4675116a20cac97e0a5", "82920" },
			{ "5ae9b4675116a20cac97e0a5", "82990" },
			{ "5ae9b43e5116a20cac97e073", "84112" },
			{ "5ae9b43e5116a20cac97e073", "84113" },
			{ "5ae9b43e5116a20cac97e073", "84122" },
			{ "5ae9b43e5116a20cac97e073", "84123" },
			{ "5ae9b43e5116a20cac97e073", "84131" },
			{ "5ae9b43e5116a20cac97e073", "84132" },
			{ "5ae9b43e5116a20cac97e073", "84133" },
			{ "5ae9b43e5116a20cac97e073", "84140" },
			{ "5ae9b43e5116a20cac97e073", "84210" },
			{ "5ae9b43e5116a20cac97e073", "84220" },
			{ "5ae9b4385116a20cac97e06c", "84231" },
			{ "5ae9b4385116a20cac97e06c", "84232" },
			{ "5ae9b4385116a20cac97e06c", "84233" },
			{ "5ae9b4385116a20cac97e06c", "84300" },
			{ "5ae9b4415116a20cac97e077", "85102" },
			{ "5ae9b44d5116a20cac97e085", "86202" },
			{ "5ae9b44b5116a20cac97e083", "86209" },
			{ "5ae9b4635116a20cac97e0a0", "92000" },
			{ "5ae9b4635116a20cac97e0a0", "93290" },
			{ "5b2b69b9b958c00860588400", "96022" },
			{ "5ae9b4585116a20cac97e092", "97000" },
			{ "5ae9b40c5116a20cac97e036", "98100" },
			{ "5ae9b40c5116a20cac97e036", "98200" },
			{ "5ae9b4595116a20cac97e094", "99011" },
			{ "5ae9b4595116a20cac97e094", "99012" },
			{ "5ae9b4675116a20cac97e0a5", "99013" },
			{ "5ae9b4585116a20cac97e092", "99014" }

		};

		public static string GetGuid(string group, string klass, string subClass)
		{
			for(int i = 0; i < lu.Length / 2; i++)
			{
				string[] str = lu[i, 1].Split(',');
				for(int j = 0; j < str.Length; j++)
				{
					if(group == str[j] || klass == str[j] || subClass == str[j])
					{
						return lu[i, 0];
					}
				}
			}
			return null;
		}
	}

	public partial class ApplicationCriteriaDto_Baseline
	{
		public class Guids
		{
			public static string BusinessCollateralNone = "0x634d5744765726af72f9ab54";
			public static string BusinessCollateralOther = "0x634d590a4d550ff4a17bbeae";
		};

		private decimal? GetPercent(
			decimal? value,
			decimal? total
		)
		{
			decimal d = (total > 0 && value != null) ? (decimal)(((float)value / (float)total) * 100.0) : 0;
			int i = (int)d;
			return (decimal)i;
		}

		public ApplicationCriteriaDto_Baseline(
			List<NameValuePairDto> criteria,
			SmeCompanyDto companyDto,
			OwnerDto ownerDto,
			List<ListItemDto> listItems,
			string tenancyName
		)
		{
			// TenancyName
			TenancyName = tenancyName;

			Criteria = criteria;

			#region criteria: 1 Loan Amount - we use all Lenders for matching 
			LoanAmount = GetLongFromString(Criteria.FirstOrDefault(x => x.Name == "loanamount")?.Value);
			#endregion

			#region criteria: 2 Finance For - we use lenders from criteria #1 matches
			FinanceForListId = Criteria.FirstOrDefault(x => x.Name == "financefor")?.Value;
			FinanceForSubListId = GetFinanceForSubListId(Criteria, FinanceForListId);
			#endregion

			#region criteria: 3 SA Citizen 
			// TODO this needs to be figured out: ownerDto.VerificationRecordJson
			IsSouthAfricanCitizen = true;
			IsPermanentResident = true;

			if(ownerDto.IsIdentityOrPassportConfirmed)
			{
				IsSouthAfricanCitizen = true;
				IsPermanentResident = true;
			}
			#endregion

			#region criteria: 4 Age - NOT MATCHED

			#endregion

			#region  criteria: 5 Race - NOT MATCHED

			#endregion

			#region criteria: 6 Gender - NOT MATCHED

			#endregion

			#region criteria: 7 Company Reg Type
			CompanyRegistrationTypeListId = companyDto.Type;
			#endregion

			#region criteria: 8 Province
			var provinceSlug = companyDto.RegisteredAddress.Split(',').ToList().Last().ToLower();
			ProvinceListId = listItems.FirstOrDefault(x => x.Slug == provinceSlug)?.ListId;
			#endregion

			#region criteria: 9 Years/Months Trading

			// TODO: TEST
			if(companyDto.StartedTradingDate.HasValue)
			{
				var StartedTradingDate = Criteria.FirstOrDefault(x => x.Name == "date-started-trading-date")?.Value;
				if(StartedTradingDate != null)
				{
					string[] dateFormats = new[] { "yyyy/MM/dd", "MM/dd/yyyy", "dd/MM/yyyy", "MM/dd/yyyyHH:mm:ss" };
					CultureInfo provider = new CultureInfo("en-US");
					DateTime date = DateTime.ParseExact(StartedTradingDate, dateFormats, provider, DateTimeStyles.AdjustToUniversal);
					YearStartedToTrade = date.Year;
					MonthStartedToTrade = date.Month;
					//DateTime date = DateTime.Parse(StartedTradingDate);
					//var startedDate = companyDto.StartedTradingDate.Value;
					//YearStartedToTrade = startedDate.Year;
					//MonthStartedToTrade = startedDate.Month;
					MonthsTrading = Math.Abs(12 * (DateTime.Now.Year - (int)YearStartedToTrade.Value) + DateTime.Now.Month - MonthStartedToTrade.Value);
				}
			}
			#endregion

			#region criteria: 10 Average Annual Turnover

			// TODO: TEST
			AverageAnnualTurnoverListId = Criteria.FirstOrDefault(x => x.Name == "select-annual-turnover")?.Value;
			var annualTurnoverListItem = listItems.FirstOrDefault(x => x.ListId == AverageAnnualTurnoverListId);
			AnnualTurnover = annualTurnoverListItem?.Name;

			if(annualTurnoverListItem != null)
			{
				AverageAnnualTurnoverMin = long.Parse(annualTurnoverListItem.MetaOne);
				AverageAnnualTurnoverMax = long.Parse(annualTurnoverListItem.MetaTwo);
			}

			#endregion

			#region criteria: 11 Industry Sector

			IndustrySectorListId = null;//companyDto.Industries;

			JObject o = JObject.Parse(companyDto.PropertiesJson);
			if(o["select-sic-group"] != null && o["select-sic-class"] != null)
			{
				string group = o["select-sic-group"].ToString();
				string subClass = o["select-sic-class"].ToString();
				int temp = Int32.Parse(subClass) / 10;
				string klass = temp.ToString();
				IndustrySectorListId = IndustryLookup.GetGuid(group, klass, subClass);
			} else {

			}
			#endregion

			#region criteria: 12 Customer Types / Supply Chain - NOT MATCHED
			#endregion

			#region criteria: 13 Monthly Income
			// TODO: This looks very suspect.
			MinimumMonthlyTurnover = (int)AverageAnnualTurnoverMax;
			#endregion

			#region criteria: 14 Income Received - NOT MATCHED
			#endregion

			#region criteria: 15 Profitability
			// TODO: TEST
			IsProfitable = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "input-made-profit-over-last-6-months")?.Value);
			#endregion

			#region criteria: 16 Collateral
			// TODO: Perhaps make sure this is not None or Other.
			// TODO: TEST

			var typeOfCollateral = Criteria.FirstOrDefault(x => x.Name == "select-type-of-collateral")?.Value;
			if(typeOfCollateral == Guids.BusinessCollateralOther || typeOfCollateral == Guids.BusinessCollateralNone)
			{
				HasCollateral = false;
			}
			else
			{
				HasCollateral = true;
			}
			//HasCollateral = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "input-value-of-collateral")?.Value);
			#endregion

			#region criteria: 52 Ownership
			// TODO: TEST
			NumberOfOwners = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "input-total-number-of-owners")?.Value);
			// TODO: Convert to percent. Baseline does the same as SEFA where it takes integer values and NOT percent.
			BlackOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "input-percent-black-coloured-indian-pdi")?.Value);
			BlackAllOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "input-percent-black-south-africans-only")?.Value);
			WhiteOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "input-percent-white-only")?.Value);
			NonSouthAfricanOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "input-percent-non-south-african-citizens")?.Value);
			BlackWomenOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "input-percent-women-black-only")?.Value);
			WomenOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "input-percent-women-women-any-race")?.Value);
			DisabledOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "input-percent-disabled-people")?.Value);
			YouthOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "input-percent-youth-under-35")?.Value);
			MilitaryVeteranOwnedPercentage = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "military-veteran-owners")?.Value);

			BlackOwnedPercentage = GetPercent(BlackOwnedPercentage, NumberOfOwners);
			BlackAllOwnedPercentage = GetPercent(BlackAllOwnedPercentage, NumberOfOwners);
			WhiteOwnedPercentage = GetPercent(WhiteOwnedPercentage, NumberOfOwners);
			NonSouthAfricanOwnedPercentage = GetPercent(NonSouthAfricanOwnedPercentage, NumberOfOwners);
			BlackWomenOwnedPercentage = GetPercent(BlackWomenOwnedPercentage, NumberOfOwners);
			WomenOwnedPercentage = GetPercent(WomenOwnedPercentage, NumberOfOwners);
			DisabledOwnedPercentage = GetPercent(DisabledOwnedPercentage, NumberOfOwners);
			YouthOwnedPercentage = GetPercent(YouthOwnedPercentage, NumberOfOwners);
			MilitaryVeteranOwnedPercentage = GetPercent(MilitaryVeteranOwnedPercentage, NumberOfOwners);

			#endregion

			#region Employees
			// TODO: TEST
			NumberOfFullTimeEmployees = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "input-number-of-permanent-employees")?.Value);
			NumberOfFullTimeWomanEmployees = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "input-number-of-permanent-female-employees")?.Value);
			NumberOfFullTimeEmployeesUnder35 = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "number-of-permanent-youth-employees-under35")?.Value);
			NumberOfPartTimeEmployees = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "input-number-of-part-time-employees")?.Value);
			NumberOfPartTimeWomanEmployees = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "input-number-of-part-time-female-employees")?.Value);
			NumberOfPartTimeEmployeesUnder35 = GetDecimalOrNull(Criteria.FirstOrDefault(x => x.Name == "input-number-of-part-time-youth-employees-under35")?.Value);

			#endregion

			#region Compliance
			// TODO: Find out where this data set is set.
			Compliance = new ComplianceDto()
			{
				ComplianceOwnerAdverseCreditBureau = Criteria.FirstOrDefault(x => x.Name == "ownerssadversecreditlistings")?.Value,
				ComplianceOwnerCreditBureauArrangement = Criteria.FirstOrDefault(x => x.Name == "ownersmadearrangements")?.Value,
				ComplianceOwnerUnderDebtReview = Criteria.FirstOrDefault(x => x.Name == "ownersunderdebtreview")?.Value,
				ComplianceOwnerInsolvency = Criteria.FirstOrDefault(x => x.Name == "ownersdeclaredinsolvent")?.Value,
				ComplianceOwnerInsolvencyRehabilitated = Criteria.FirstOrDefault(x => x.Name == "ownersrehabilitated")?.Value,
				ComplianceCompanyAdverseCreditBureau = Criteria.FirstOrDefault(x => x.Name == "directorsadversecreditlistings")?.Value,
				ComplianceCompanyCreditBureauArrangement = Criteria.FirstOrDefault(x => x.Name == "directorsmadearrangements")?.Value,
				ComplianceCompanyUnderDebtReview = Criteria.FirstOrDefault(x => x.Name == "directorsunderdebtreview")?.Value,
				ComplianceCompanyInsolvency = Criteria.FirstOrDefault(x => x.Name == "directorsdeclaredinsolvent")?.Value,
				ComplianceCompanyInsolvencyRehabilitated = Criteria.FirstOrDefault(x => x.Name == "directorsrehabilitated")?.Value,
				ComplianceHonestDeclaration = Criteria.FirstOrDefault(x => x.Name == "summarydeclaration")?.Value
			};

			#endregion

			#region SmmeDocs
			SmmeDocs = new List<SmmeDocDto>();
			// CIPC - Company Registration Documents
			SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5aaf6d123a022727ec3b587a", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5aaf6d123a022727ec3b587a")?.Value });
			// CIPC - Annual Returns
			SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "60549c63a2b3b4fb7c24bb34", DocStatus = Criteria.FirstOrDefault(x => x.Name == "60549c63a2b3b4fb7c24bb34")?.Value });
			// Certified Copies of Owners ID
			SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5ab0cdb53efed8141436959b", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5ab0cdb53efed8141436959b")?.Value });
			// Proof of Business Address
			SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5b2a54ecb958c008605883ff", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5b2a54ecb958c008605883ff")?.Value });
			// BEE Certificate
			SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "60549db9e3032aa608a98cc1", DocStatus = Criteria.FirstOrDefault(x => x.Name == "60549db9e3032aa608a98cc1")?.Value });
			// Company Bank Statements
			SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5aaf6d193a022727ec3b587b", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5aaf6d193a022727ec3b587b")?.Value });
			// 12 Months Budget and Projections
			SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5ab0ce1d3efed814143695a1", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5ab0ce1d3efed814143695a1")?.Value });
			// Statements of Assets and Liabilities
			SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5ab0cdd73efed8141436959d", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5ab0cdd73efed8141436959d")?.Value });
			// Tax Clearance Cert
			SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5ab0cdc33efed8141436959c", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5ab0cdc33efed8141436959c")?.Value });
			// Business Plan
			SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5ab0cde13efed8141436959e", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5ab0cde13efed8141436959e")?.Value });
			// Management Accounts
			SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5ab0cdfc3efed814143695a0", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5ab0cdfc3efed814143695a0")?.Value });
			// Annual Financial Statement
			SmmeDocs.Add(new SmmeDocDto() { DocumentListId = "5ab0cded3efed8141436959f", DocStatus = Criteria.FirstOrDefault(x => x.Name == "5ab0cded3efed8141436959f")?.Value });

			#endregion

			#region criteria: 66 Bee Level

			// TODO: TEST
			BeeLevelListId = Criteria.FirstOrDefault(x => x.Name == "select-company-profile-bee-level")?.Value;
			#endregion

			#region Finance For Sub

			#region Working Capital

			// Cash for Invoice
			if(FinanceForSubListId == "59cc9d26132f4c40c446a4f7")
			{
				var customerProfileListId = Criteria.FirstOrDefault(x => x.Name == "cashforinvoicecustomer")?.Value;

				CashForAnInvoice = new CashForInvoiceDto
				{
					// criteria: 21 Cash for an invoice - Invoice value
					InvoiceValue = GetIntOrNull(Criteria.FirstOrDefault(x => x.Name == "cashforaninvoiceamount")?.Value),

					// criteria: 22 Cash for an invoice - Customer Profile
					CustomerProfileListId = customerProfileListId,

					// List Item literal
					CustomerProfile = GetListNameFor(customerProfileListId, listItems)
				};
			}

			// Money for Contract
			if(FinanceForSubListId == "59cca8a430e9df02c82d0795")
			{
				var customerProfileListId = Criteria.FirstOrDefault(x => x.Name == "moneyforcontractcustomer")?.Value;

				MoneyForContract = new MoneyForContractDto
				{
					// criteria: 23 Money for contract - Contract value
					ContractAmount = GetIntOrNull(Criteria.FirstOrDefault(x => x.Name == "moneyforcontractvalue")?.Value),

					// criteria: 24 Money for contract - Customer Profile
					CustomerProfileListId = customerProfileListId,

					// list item literal
					CustomerProfile = GetListNameFor(customerProfileListId, listItems),

					// criteria: 25 Money for contract - Experience
					Experience = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "moneyforcontractcompanyexperience")?.Value)
				};
			}

			// Money for Tender
			if(FinanceForSubListId == "59cca89030e9df02c82d0794")
			{
				var customerProfileListId = Criteria.FirstOrDefault(x => x.Name == "moneyfortendercustomer")?.Value;

				MoneyForTender = new MoneyForTenderDto
				{
					// criteria: 26 Money for tender - Tender value
					TenderValue = GetIntOrNull(Criteria.FirstOrDefault(x => x.Name == "moneyfortendervalue")?.Value),

					// criteria: 27 Money for tender - Customer Profile
					CustomerProfileListId = customerProfileListId,

					CustomerProfile = GetListNameFor(customerProfileListId, listItems),

					// criteria: 28 Money for tender - Experience
					Experience = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "moneyfortendercompanyexperience")?.Value)
				};
			}

			// Cash for Retailers
			//criteria: 56 - Income Received
			HowIncomeReceivedListIds = string.Join(",", Criteria.Where(x => x.Name == "cardmachinepaymenttypes")?.Select(x => x.Value).ToList());

			//criteria: 57 - Monthly Income Retail
			MonthlyIncomeRetail = GetIntOrNull(Criteria.FirstOrDefault(x => x.Name == "monthlyincomeincomevalue")?.Value);

			// Purchase Order Funding
			if(FinanceForSubListId == "5b213996b958c008605883e8")
			{
				var customerProfileListId = Criteria.FirstOrDefault(x => x.Name == "purchaseordercustomer")?.Value;

				PurchaseOrderFunding = new PurchaseOrderFundingDto
				{
					//criteria: 53 - Purchase Order Funding - Contract value
					FundingAmount = GetIntOrNull(Criteria.FirstOrDefault(x => x.Name == "purchaseordervalue")?.Value),

					//criteria: 54 - Purchase Order Funding - Customer Profile
					CustomerProfileListId = customerProfileListId,

					CustomerProfile = GetListNameFor(customerProfileListId, listItems),

					//criteria: 55 - Purchase Order Funding- Experience
					Experience = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "purchaseordercustomerexperience")?.Value)
				};
			}

			// Cashflow Assistance
			if(FinanceForSubListId == "59cc9d36132f4c40c446a4f8")
			{
				// criteria 66 - Has Point of sale
				var hasPoS = Criteria.FirstOrDefault(x => x.Name == "hasposdevice")?.Value == "No" ? false : true;

				CashFlowAssistance = new CashFlowAssistanceDto() { HasPosDevice = hasPoS };
			}


			#endregion

			#region Asset Finance

			// Buying Business Property
			if(FinanceForSubListId == "59d2694720070a604097b047")
			{
				var propertyTypeListId = Criteria.FirstOrDefault(x => x.Name == "buyingbusinesspropertytype")?.Value;

				BuyingBusinessProperty = new BuyingBusinessPropertyDto
				{
					// criteria: 29 - Buying business property - property value
					PropertyValue = GetIntOrNull(Criteria.FirstOrDefault(x => x.Name == "buyingbusinesspropertyvalue")?.Value),

					// criteria: 30 - Buying business property - Property type
					PropertyTypeListId = propertyTypeListId,

					// ListItem literal
					PropertyType = GetListNameFor(propertyTypeListId, listItems)
				};
			}

			// Property Development
			if(FinanceForSubListId == "59d2695420070a604097b048")
			{
				var developmentTypeListId = Criteria.FirstOrDefault(x => x.Name == "propertydevelopmenttype")?.Value;

				PropertyDevelopment = new PropertyDevelopmentDto
				{
					// criteria: 33 Property Development - development type
					DevelopmentTypeListId = developmentTypeListId,

					// ListItem literal
					DevelopmentType = GetListNameFor(developmentTypeListId, listItems)
				};
			}

			// Shopfitting Renovations
			if(FinanceForSubListId == "59d2693920070a604097b046")
			{
				var propertyTypeListId = Criteria.FirstOrDefault(x => x.Name == "shopfittingpropertytype")?.Value;

				ShopFittingRenovations = new ShopFittingRenovationsDto
				{
					// criteria: 31 Shop Fitting Renovations - unbonded - shopfittingpropbonded
					IsPropertyBonded = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "shopfittingpropbonded")?.Value),

					// criteria: 32 Shop Fitting Renovations - Property type - shopfittingpropertytype
					PropertyTypeListId = propertyTypeListId,

					// ListItem literal
					PropertyType = GetListNameFor(propertyTypeListId, listItems)
				};
			}

			#endregion

			#region Growth Finance

			// Business Expansion
			if(FinanceForSubListId == "59d269bd20070a604097b04a")
			{
				BusinessExpansion = new BusinessExpansionDto
				{
					// criteria: 34 Business expansion - equity
					WillSellShares = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "willingtosellshares")?.Value),

					// criteria: 35 Business expansion - job creation
					IncreasedEmployees = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businessexpansionresultinincreasedemployees")?.Value),

					// criteria: 36 - Business expansion - profitability
					IncreasedProfitability = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businessexpansionresultinincreasedprofitability")?.Value),

					// criteria: 37 - Business expansion - exports
					IncreasedExports = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businessexpansionresultinincreasedexports")?.Value),

					// criteria: 38 - Business expansion - empowerment
					Empowerment = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businessexpansionresultineconomicempowerment")?.Value),

					// criteria: 39 - Business expansion - rural
					RuralDevelopment = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businessexpansionresultinsustainabledev")?.Value),

					// criteria: 40 - Business expansion - social
					SolvesSocial = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businessexpansionresultinsolveenvchallenges")?.Value)
				};
			}

			// Product Service Expansion
			if(FinanceForSubListId == "59d269c920070a604097b04b")
			{
				var typeOfExpansionListId = Criteria.FirstOrDefault(x => x.Name == "productserviceexpansiontype")?.Value;

				ProductServiceExpansion = new ProductServiceExpansionDto
				{
					//criteria: 41 - Product Service expansion -type of expansion
					TypeOfExpansionListId = typeOfExpansionListId,

					// ListItem literal
					TypeOfExpansion = GetListNameFor(typeOfExpansionListId, listItems)
				};
			}

			#endregion

			#region Franchise Acquisition

			// Buying a Franchise
			if(FinanceForSubListId == "59c2c7087c83b736d463c255")
			{
				BuyingAFranchise = new BuyingAFranchiseDto
				{
					//criteria: 42 - Buying a franchise - accredited
					Accredited = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "buyingafranchisefranchiseaccredited")?.Value),

					//criteria: 43 - Buying a franchise - preapproved
					Preapproved = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "preapprovedbyfranchisor")?.Value)
				};
			}

			// BEE partner
			if(FinanceForSubListId == "59d26a3120070a604097b04f")
			{
				BeePartner = new BeePartnerDto
				{
					//criteria: 48 - BEE Partner - min bee
					MinimumBeeShareholding = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "beepartnerfranchiseaccredited")?.Value)
				};
			}

			// Buy an existing Business
			if(FinanceForSubListId == "59d26a1620070a604097b04d")
			{
				var businessTypeListId = Criteria.FirstOrDefault(x => x.Name == "fundingtobuyanexistingbusinesstype")?.Value;
				var industrySubSectorListId = Criteria.FirstOrDefault(x => x.Name == "industry-sub-sector")?.Value;

				BuyingABusiness = new BuyingABusinessDto
				{
					//criteria: 45 - Buying a business - industry sector
					IndustrySectorLevel1ListId = GetListParentListId(industrySubSectorListId, listItems),
					IndustrySectorListId = industrySubSectorListId,

					//criteria: 46 - Buying a business - business type
					BusinessTypeListId = businessTypeListId,

					BusinessType = GetListNameFor(businessTypeListId, listItems),

					//criteria: 47 - Buying a business - rural 
					RuralOrTownship = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "businesslocatedinruralarea")?.Value)
				};
			}

			// Partner Management Buyout
			if(FinanceForSubListId == "59d26a2620070a604097b04e")
			{
				PartnerManagementBuyOut = new PartnerManagementBuyOutDto
				{
					//criteria: 44 - Partner management buyout - min bee
					MinimumBeeShareholding = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "shareholdinggreaterthanperc")?.Value)
				};
			}

			#endregion

			#region Research Innovation

			// Commercialising Research
			if(FinanceForSubListId == "5acb25f862ba593724e0a788")
			{
				var productListIds = Criteria.FirstOrDefault(x => x.Name == "commresindustries")?.Value;

				CommercialisingResearch = new CommercialisingResearchDto
				{
					// criteria: 61 Student Status 
					StudentStatus = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "commresstudentstatus")?.Value),

					// criteria: 62 - Increase exports 
					IncreasedExports = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "commreswillincexports")?.Value),

					// criteria: 63 - Job creations 
					JobCreation = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "commresresultinjobcreation")?.Value),

					// criteria: 64 - Innovation 
					Innovation = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "commresintroinnov")?.Value),

					// criteria: 65 - Products 
					ProductListIds = productListIds,

					// ListItem literal
					Products = GetListNamesFor(productListIds, listItems)
				};
			}

			#endregion

			#region Other Funding

			// Business Processing Services
			if(FinanceForSubListId == "59d26d8720070a604097b059")
			{
				BusinessProcessingServices = new BusinessProcessingServicesDto
				{
					//criteria: 58 - Job Creation 
					JobCreation = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "willworkgenerate50newjobs")?.Value),

					//criteria: 59 - Secure Contracts 
					SecureContracts = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "doyouhavecontractsforbps")?.Value),

					//criteria: 60 - Youth Jobs will80percofjobsbeforyouth
					YouthJobs = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "will80percofjobsbeforyouth")?.Value)
				};
			}

			// Export
			if(FinanceForSubListId == "59d26a6420070a604097b052")
			{
				Export = new ExportDto
				{
					ConfirmedExportOrder = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "haveconfirmedorders")?.Value)
				};
			}

			// Import
			if(FinanceForSubListId == "59d26d3120070a604097b053")
			{
				Import = new ImportDto
				{
					SignedContract = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "havesignedcontracts")?.Value)
				};
			}

			#endregion

			#endregion

			#region Other
			// TODO: TEST
			var businessBankListId = Criteria.FirstOrDefault(x => x.Name == "select-business-account-bank")?.Value;
			if(!string.IsNullOrEmpty(businessBankListId))
				BusinessBank = listItems.FirstOrDefault(x => x.ListId == businessBankListId).Name;

			// TODO: TEST
			var bankServiceListIds = criteria.Where(x => x.Name == "bankaccservices").Select(x => x.Value).ToList();
			if(bankServiceListIds.Count > 0)
			{
				var bankServices = new List<string>();
				foreach(var bankService in bankServiceListIds)
					bankServices.Add($"{listItems.FirstOrDefault(x => x.ListId == bankService)?.Name}");
				BankAccountServices = String.Join(",", bankServices).Replace(",", ", ");
			}

			// TODO: TEST. 
			// TODO: Perhaps check the associated yes/no radio.
			var otherBusinessLoansListId = Criteria.FirstOrDefault(x => x.Name == "select-who-is-this-loan-from")?.Value;
			if(!string.IsNullOrEmpty(otherBusinessLoansListId))
				OtherBusinessLoans = listItems.FirstOrDefault(x => x.ListId == otherBusinessLoansListId)?.Name;

			// TODO: TEST. 
			// TODO: Perhaps check the associated yes/no radio.
			var personalBankListId = Criteria.FirstOrDefault(x => x.Name == "select-who-do-you-bank-with-personally")?.Value;
			if(!string.IsNullOrEmpty(personalBankListId))
				PersonalBank = listItems.FirstOrDefault(x => x.ListId == personalBankListId)?.Name;

			// TODO: TEST. 
			// TODO: Perhaps check the associated yes/no radio.
			var electronicAccountingSystemsListId = Criteria.FirstOrDefault(x => x.Name == "select-which-accounting-system-do-you-have")?.Value;
			if(!string.IsNullOrEmpty(electronicAccountingSystemsListId))
				ElectronicAccountingSystems = listItems.FirstOrDefault(x => x.ListId == electronicAccountingSystemsListId)?.Name;

			// TODO: TEST. 
			// TODO: Perhaps check the associated yes/no radio.
			OtherElectronicAccountingSystems = Criteria.FirstOrDefault(x => x.Name == "input-acounting-system-other")?.Value;

			// TODO: TEST. 
			// TODO: Perhaps check the associated yes/no radio.
			var payrollSystemListId = Criteria.FirstOrDefault(x => x.Name == "select-which-electronic-payroll-system")?.Value;
			if(!string.IsNullOrEmpty(payrollSystemListId))
				PayrollSystem = listItems.FirstOrDefault(x => x.ListId == payrollSystemListId)?.Name;

			// TODO: TEST. 
			// TODO: Perhaps check the associated yes/no radio.
			OtherPayrollSystem = Criteria.FirstOrDefault(x => x.Name == "input-payroll-system-other")?.Value;

			// TODO: TEST
			InvestedOwnMoney = Criteria.FirstOrDefault(x => x.Name == "input-has-invested-own-money")?.Value;

			// TODO: Get from key things page.
			DoYouKnowYourPersonalCreditScore = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "input-credit-score-declaration")?.Value);

			// TODO: Get from finance info page.
			HasElecAccSystems = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "input-has-electronic-accounting-system")?.Value);

			// TODO: Get from finance info page.
			HasPayroll = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "input-use-payroll-system-for-staff-payslips")?.Value);

			// TODO: Get from key things page.
			WantToUploadBusBankStatements = true;//GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "wanttouploadbusbankstatements")?.Value);

			// TODO: TEST
			BusinessTxPersonalAcc = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "input-any-business-transactions-through-personal-accounts")?.Value);

			// TODO: TEST. Part of Working Capital.
			RegularMonthlyIncome = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "regularmonthlyincome")?.Value);

			// TODO: Find this question in the new wizard.
			SeeksFundingAdvice = GetBoolOrNull(Criteria.FirstOrDefault(x => x.Name == "name-input-seeks-funding-advice")?.Value);

			#endregion
		}

		public static string GetFinanceForSubListId(List<NameValuePairDto> criteria, string financeForListId)
		{

			if(financeForListId == "59c35d64463361150873b641")
			{
				return criteria.FirstOrDefault(x => x.Name == "assetfinancetype").Value;
			}
			else if(financeForListId == "59c2c6b37c83b736d463c251")
			{
				return criteria.FirstOrDefault(x => x.Name == "workingcapitaltype").Value;
			}
			else if(financeForListId == "59c5d92b5eac2311202772f5")
			{
				return criteria.FirstOrDefault(x => x.Name == "growthfinancetype").Value;
			}
			else if(financeForListId == "59c2c6f77c83b736d463c254")
			{
				return criteria.FirstOrDefault(x => x.Name == "franchiseacquisitiontype").Value;
			}
			else if(financeForListId == "59c5d95c5eac2311202772f6")
			{
				return criteria.FirstOrDefault(x => x.Name == "researchinnovationfundingtype").Value;
			}
			else if(financeForListId == "59c5d96b5eac2311202772f7")
			{
				return criteria.FirstOrDefault(x => x.Name == "otherfinancetype").Value;
			}

			return string.Empty;
		}


		#region Utility Methods

		private string GetListNamesFor(string productListIds, List<ListItemDto> listItems)
		{
			var response = string.Empty;
			foreach(var item in productListIds.Split(',').ToList())
				response = response + item + ",";

			return response;
		}

		private string GetListNameFor(string propertyTypeListId, List<ListItemDto> listItems)
		{
			return listItems.FirstOrDefault(x => x.ListId == propertyTypeListId)?.Name;
		}

		private string GetListParentListId(string propertyTypeListId, List<ListItemDto> listItems)
		{
			return listItems.FirstOrDefault(x => x.ListId == propertyTypeListId)?.ParentListId;
		}

		private int? GetIntOrNull(string value)
		{
			if(string.IsNullOrEmpty(value))
				return null;

			value = value.Replace(" ", "");

			int index = value.IndexOf(".");

			if(index >= 0)
				value = value.Substring(0, index);

			return int.TryParse(value, out int intValue) ? intValue : (int?)null;
		}

		private long GetLongFromString(string value)
		{
			if(string.IsNullOrEmpty(value))
				return 0;

			value = value.Replace(" ", "");

			int index = value.IndexOf(".");

			if(index >= 0)
				value = value.Substring(0, index);

			return long.TryParse(value, out long longValue) ? longValue : 0;
		}

		private decimal? GetDecimalOrNull(string value)
		{
			if(string.IsNullOrEmpty(value))
				return null;

			value = value.Replace(" ", "");

			return decimal.TryParse(value, out decimal decValue) ? decValue : 0;
		}

		private bool? GetBoolOrNull(string value)
		{
			if(string.IsNullOrEmpty(value))
				return null;

			if(value.ToLower() == "yes")
				return true;

			if(value.ToLower() == "no")
				return false;

			return null;
		}
		#endregion

		#region Matching Properties
		public long LoanAmount { get; set; }
		public string AnnualTurnover { get; set; }
		public string FinanceForListId { get; set; }
		public bool? IsSouthAfricanCitizen { get; set; }
		public bool? IsPermanentResident { get; set; }
		public string CompanyRegistrationTypeListId { get; set; }
		public string ProvinceListId { get; set; }
		public int? YearStartedToTrade { get; set; }
		public int? MonthStartedToTrade { get; set; }
		public int? MonthsTrading { get; set; }
		public string FinanceForSubListId { get; set; }

		public string AverageAnnualTurnoverListId { get; set; }
		public long AverageAnnualTurnoverMin { get; set; }
		public long AverageAnnualTurnoverMax { get; set; }
		public int MinimumMonthlyTurnover { get; set; }
		public string IndustrySectorListId { get; set; }
		public bool? IsProfitable { get; set; }
		public bool? HasCollateral { get; set; }
		public string BeeLevelListId { get; set; }

		public string BusinessBank { get; set; }
		public string BankAccountServices { get; set; }
		public string PersonalBank { get; set; }
		public string OtherBusinessLoans { get; set; }
		public string ElectronicAccountingSystems { get; set; }
		public string OtherElectronicAccountingSystems { get; set; }
		public string PayrollSystem { get; set; }
		public string OtherPayrollSystem { get; set; }
		public string InvestedOwnMoney { get; set; }
		public bool? DoYouKnowYourPersonalCreditScore { get; set; }
		public bool? HasElecAccSystems { get; set; }
		public bool? HasPayroll { get; set; }
		public bool? WantToUploadBusBankStatements { get; set; }
		public bool? BusinessTxPersonalAcc { get; set; }
		public bool? RegularMonthlyIncome { get; set; }

		public decimal? BlackOwnedPercentage { get; set; }
		public decimal? BlackAllOwnedPercentage { get; set; }
		public decimal? WhiteOwnedPercentage { get; set; }
		public decimal? NonSouthAfricanOwnedPercentage { get; set; }
		public decimal? BlackWomenOwnedPercentage { get; set; }
		public decimal? WomenOwnedPercentage { get; set; }
		public decimal? DisabledOwnedPercentage { get; set; }
		public decimal? YouthOwnedPercentage { get; set; }
		public decimal? MilitaryVeteranOwnedPercentage { get; set; }
		public decimal? NumberOfOwners { get; set; }

		public decimal? NumberOfFullTimeEmployees { get; set; }
		public decimal? NumberOfFullTimeWomanEmployees { get; set; }
		public decimal? NumberOfFullTimeEmployeesUnder35 { get; set; }
		public decimal? NumberOfPartTimeEmployees { get; set; }
		public decimal? NumberOfPartTimeWomanEmployees { get; set; }
		public decimal? NumberOfPartTimeEmployeesUnder35 { get; set; }


		public CashForInvoiceDto CashForAnInvoice { get; set; }
		public MoneyForContractDto MoneyForContract { get; set; }
		public MoneyForTenderDto MoneyForTender { get; set; }
		public BuyingBusinessPropertyDto BuyingBusinessProperty { get; set; }
		public ShopFittingRenovationsDto ShopFittingRenovations { get; set; }
		public PropertyDevelopmentDto PropertyDevelopment { get; set; }
		public BusinessExpansionDto BusinessExpansion { get; set; }
		public ProductServiceExpansionDto ProductServiceExpansion { get; set; }
		public BuyingAFranchiseDto BuyingAFranchise { get; set; }
		public PartnerManagementBuyOutDto PartnerManagementBuyOut { get; set; }
		public BuyingABusinessDto BuyingABusiness { get; set; }
		public BeePartnerDto BeePartner { get; set; }
		public ExportDto Export { get; set; }
		public ImportDto Import { get; set; }
		public PurchaseOrderFundingDto PurchaseOrderFunding { get; set; }
		public string HowIncomeReceivedListIds { get; set; }
		public int? MonthlyIncomeRetail { get; set; }
		public BusinessProcessingServicesDto BusinessProcessingServices { get; set; }
		public CommercialisingResearchDto CommercialisingResearch { get; set; }

		public List<NameValuePairDto> Criteria { get; set; }
		public string TenancyName { get; set; }
		public CashFlowAssistanceDto CashFlowAssistance { get; set; }
		public ComplianceDto Compliance { get; set; }
		public List<SmmeDocDto> SmmeDocs { get; set; }
		#endregion

		public bool? SeeksFundingAdvice { get; set; }
	}


}
