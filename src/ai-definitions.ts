import { FixedAI, VariableAI } from './types';

/**
 * Fixed-length Application Identifiers (AI) with predefined length
 */
export const FIXED_AI: FixedAI = {
  '00': 18,   // SSCC — Identification of a logistic unit: AI (00)
  '01': 14,   // GTIN — Identification of a trade item: AI (01)
  '02': 14,   // CONTENT — Identification of trade items contained in a logistic unit: AI (02)
  '03': 14,   // MTO GTIN — Identification of a Made-to-Order (MtO) trade item (GTIN): AI (03)

  '11': 6,    // PROD DATE — Production date (YYMMDD): AI (11)
  '12': 6,    // DUE DATE — Due date for amount on payment slip (YYMMDD): AI (12)
  '13': 6,    // PACK DATE — Packaging date (YYMMDD): AI (13)
  '15': 6,    // BEST BEFORE or BEST BY — Best before date (YYMMDD): AI (15)
  '16': 6,    // SELL BY — Sell by date (YYMMDD): AI (16)
  '17': 6,    // USE BY OR EXPIRY — Expiration date (YYMMDD): AI (17)

  '20': 2,    // VARIANT — Internal product variant: AI (20)

  // --- Trade measures / logistic measures with decimal indicator (value length = 6) ---
  '310n': 6,  // NET WEIGHT (kg) — variable measure trade item: AI (310n)
  '311n': 6,  // LENGTH (m): AI (311n)
  '312n': 6,  // WIDTH (m): AI (312n)
  '313n': 6,  // HEIGHT (m): AI (313n)
  '314n': 6,  // AREA (m²): AI (314n)
  '315n': 6,  // NET VOLUME (l): AI (315n)
  '316n': 6,  // NET VOLUME (m³): AI (316n)

  '320n': 6,  // NET WEIGHT (lb): AI (320n)
  '321n': 6,  // LENGTH (in): AI (321n)
  '322n': 6,  // LENGTH (ft): AI (322n)
  '323n': 6,  // LENGTH (yd): AI (323n)
  '324n': 6,  // WIDTH (in): AI (324n)
  '325n': 6,  // WIDTH (ft): AI (325n)
  '326n': 6,  // WIDTH (yd): AI (326n)
  '327n': 6,  // HEIGHT (in): AI (327n)
  '328n': 6,  // HEIGHT (ft): AI (328n)
  '329n': 6,  // HEIGHT (yd): AI (329n)

  '330n': 6,  // GROSS WEIGHT (kg): AI (330n)
  '331n': 6,  // LENGTH (m), log: AI (331n)
  '332n': 6,  // WIDTH (m), log: AI (332n)
  '333n': 6,  // HEIGHT (m), log: AI (333n)
  '334n': 6,  // AREA (m²), log: AI (334n)
  '335n': 6,  // VOLUME (l), log: AI (335n)
  '336n': 6,  // VOLUME (m³), log: AI (336n)
  '337n': 6,  // KG PER m² — Kilograms per square metre: AI (337n)

  '340n': 6,  // GROSS WEIGHT (lb): AI (340n)
  '341n': 6,  // LENGTH (in), log: AI (341n)
  '342n': 6,  // LENGTH (ft), log: AI (342n)
  '343n': 6,  // LENGTH (yd), log: AI (343n)
  '344n': 6,  // WIDTH (in), log: AI (344n)
  '345n': 6,  // WIDTH (ft), log: AI (345n)
  '346n': 6,  // WIDTH (yd), log: AI (346n)
  '347n': 6,  // HEIGHT (in), log: AI (347n)
  '348n': 6,  // HEIGHT (ft), log: AI (348n)
  '349n': 6,  // HEIGHT (yd), log: AI (349n)

  '350n': 6,  // AREA (in²): AI (350n)
  '351n': 6,  // AREA (ft²): AI (351n)
  '352n': 6,  // AREA (yd²): AI (352n)
  '353n': 6,  // AREA (in²), log: AI (353n)
  '354n': 6,  // AREA (ft²), log: AI (354n)
  '355n': 6,  // AREA (yd²), log: AI (355n)
  '356n': 6,  // NET WEIGHT (troy oz): AI (356n)
  '357n': 6,  // NET VOLUME (oz): AI (357n)

  '360n': 6,  // NET VOLUME (qt): AI (360n)
  '361n': 6,  // NET VOLUME (US gal): AI (361n)
  '362n': 6,  // VOLUME (qt), log: AI (362n)
  '363n': 6,  // VOLUME (US gal), log: AI (363n)
  '364n': 6,  // VOLUME (in³): AI (364n)
  '365n': 6,  // VOLUME (ft³): AI (365n)
  '366n': 6,  // VOLUME (yd³): AI (366n)
  '367n': 6,  // VOLUME (in³), log: AI (367n)
  '368n': 6,  // VOLUME (ft³), log: AI (368n)
  '369n': 6,  // VOLUME (yd³), log: AI (369n)

  '394n': 4,  // PRCNT OFF — Percentage discount of a coupon: AI (394n)
  '395n': 6,  // PRICE/UoM — Amount payable per unit of measure (single area): AI (395n)

  '402': 17,  // GSIN — Global Shipment Identification Number: AI (402)

  '410': 13,  // SHIP TO LOC — Consignee GLN: AI (410)
  '411': 13,  // BILL TO — Invoicee GLN: AI (411)
  '412': 13,  // PURCHASE FROM — Purchased from GLN: AI (412)
  '413': 13,  // SHIP FOR LOC — Ship for / Deliver for / Forward to GLN: AI (413)
  '414': 13,  // LOC No — Identification of a physical location (GLN): AI (414)
  '415': 13,  // PAY TO — GLN of the invoicing party: AI (415)
  '416': 13,  // PROD/SERV LOC — GLN of production/service location: AI (416)
  '417': 13,  // PARTY — Party GLN: AI (417)

  '422': 3,   // ORIGIN — Country of origin of a trade item: AI (422)
  '424': 3,   // COUNTRY - PROCESS. — Country of processing: AI (424)
  '426': 6,   // COUNTRY – FULL PROCESS — Country covering full process chain: AI (426)

  '4307': 2,  // SHIP TO COUNTRY — Ship-to / Deliver-to country code: AI (4307) (X2)
  '4309': 20, // SHIP TO GEO — Ship-to / Deliver-to GEO location: AI (4309)
  '4317': 2,  // RTN TO COUNTRY — Return-to country code: AI (4317) (X2)
  '4321': 1,  // DANGEROUS GOODS — Dangerous goods flag: AI (4321)
  '4322': 1,  // AUTH LEAVE — Authority to leave flag: AI (4322)
  '4323': 1,  // SIG REQUIRED — Signature required flag: AI (4323)
  '4324': 10, // NBEF DEL DT — Not before delivery date/time (YYYYMMDDhh): AI (4324)
  '4325': 10, // NAFT DEL DT — Not after  delivery date/time (YYYYMMDDhh): AI (4325)
  '4326': 6,  // REL DATE — Release date (YYMMDD): AI (4326)

  '7001': 13, // NSN — NATO Stock Number: AI (7001)
  '7003': 10, // EXPIRY TIME — Expiration date and time (YYYYMMDDhh): AI (7003)
  '7006': 6,  // FIRST FREEZE DATE (YYMMDD): AI (7006)
  '7040': 4,  // UIC+EXT — GS1 UIC with Extension 1 and Importer index (N1+X3): AI (7040)
  '7241': 2,  // AIDC MEDIA TYPE — AIDC media type: AI (7241)
  '7250': 8,  // DOB — Date of birth: AI (7250)
  '7251': 12, // DOB TIME — Date and time of birth: AI (7251)
  '7252': 1,  // BIO SEX — Biological sex: AI (7252)
  '7258': 3,  // BIRTH SEQUENCE — Baby birth sequence indicator: AI (7258)

  '8001': 14, // DIMENSIONS — Roll products: width/length/... (N14): AI (8001)
  '8005': 6,  // PRICE PER UNIT — Price per unit of measure: AI (8005)
  '8006': 18, // ITIP — Identification of an individual trade item piece (N14+N2+N2): AI (8006)
  '8017': 18, // GSRN - PROVIDER — Global Service Relation Number: AI (8017)
  '8018': 18, // GSRN - RECIPIENT — Global Service Relation Number: AI (8018)

  '8026': 18, // ITIP CONTENT — ID of pieces of a trade item contained in a logistic unit (N14+N2+N2): AI (8026)

  '8111': 4,  // POINTS — Loyalty points of a coupon: AI (8111)
};

/**
 * Variable-length Application Identifiers (AI) with maximum length
 */
export const VARIABLE_AI: VariableAI = {
  '10': 20,   // BATCH/LOT — Batch or lot number: AI (10)
  '21': 20,   // SERIAL — Serial number: AI (21)
  '22': 20,   // CPV — Consumer product variant: AI (22)

  '235': 28,  // TPX — Third Party Controlled, Serialised Extension of GTIN: AI (235)
  '240': 30,  // ADDITIONAL ID — Additional product ID by manufacturer: AI (240)
  '241': 30,  // CUST. PART NO. — Customer part number: AI (241)
  '242': 6,   // N..6 — Made-to-Order variation number: AI (242)
  '243': 20,  // PCN — Packaging component number: AI (243)
  '250': 30,  // SECONDARY SERIAL — Secondary serial number: AI (250)
  '251': 30,  // REF. TO SOURCE — Reference to source entity: AI (251)
  '253': 30,  // GDTI — Global Document Type Identifier (N13+X..17): AI (253)
  '254': 20,  // GLN EXTENSION COMPONENT — GLN extension component: AI (254)
  '255': 25,  // GCN — Global Coupon Number (N13+N..12): AI (255)

  '30': 8,    // VAR. COUNT — Variable count of items (N..8): AI (30)
  '37': 8,    // COUNT — Count of trade items/pieces in a logistic unit (N..8): AI (37)

  // Monetary amounts
  '390n': 15, // AMOUNT — Amount payable / coupon value, single monetary area (N..15): AI (390n)
  '391n': 18, // AMOUNT — Amount payable + ISO currency (N3+N..15): AI (391n)
  '392n': 15, // PRICE — Amount payable for variable measure item, single area (N..15): AI (392n)
  '393n': 18, // PRICE — Amount payable for variable measure item + currency (N3+N..15): AI (393n)

  // Party/location & origin
  '400': 30,  // ORDER NUMBER — Customer's purchase order number: AI (400)
  '401': 30,  // GINC — Global Identification Number for Consignment: AI (401)
  '403': 30,  // ROUTE — Routing code: AI (403)

  '420': 20,  // SHIP TO POST — Ship-to/Deliver-to postal code (national): AI (420)
  '421': 12,  // SHIP TO POST — Postal code + 3-digit ISO country (N3+X..9): AI (421)
  '423': 15,  // COUNTRY - INITIAL PROCESS. — Country of initial processing (N3+N..12 plus country): AI (423)
  '425': 18,  // COUNTRY - DISASSEMBLY — Country of disassembly (N3+N..12 plus country): AI (425)
  '427': 6,   // ORIGIN SUBDIVISION — Country subdivision of origin code (N3+X..3): AI (427)

  // Extended ship-to / return-to address block (4300–4320)
  '4300': 35, // SHIP TO COMP — Ship-to/Deliver-to Company name: AI (4300)
  '4301': 35, // SHIP TO NAME — Ship-to/Deliver-to contact name: AI (4301)
  '4302': 70, // SHIP TO ADD1 — Address line 1: AI (4302)
  '4303': 70, // SHIP TO ADD2 — Address line 2: AI (4303)
  '4304': 70, // SHIP TO SUB — Suburb: AI (4304)
  '4305': 70, // SHIP TO LOC — Locality: AI (4305)
  '4306': 70, // SHIP TO REG — Region: AI (4306)
  // 4307 в FIXED_AI (X2 country code)
  '4308': 30, // SHIP TO PHONE — Telephone number: AI (4308)

  '4310': 35, // RTN TO COMP — Return-to company name: AI (4310)
  '4311': 35, // RTN TO NAME — Return-to contact name: AI (4311)
  '4312': 70, // RTN TO ADD1 — Return-to address line 1: AI (4312)
  '4313': 70, // RTN TO ADD2 — Return-to address line 2: AI (4313)
  '4314': 70, // RTN TO SUB — Return-to suburb: AI (4314)
  '4315': 70, // RTN TO LOC — Return-to locality: AI (4315)
  '4316': 70, // RTN TO REG — Return-to region: AI (4316)
  // 4317 в FIXED_AI (X2 country code)
  '4318': 20, // RTN TO POST — Return-to postal code: AI (4318)
  '4319': 30, // RTN TO PHONE — Return-to telephone number: AI (4319)
  '4320': 35, // SRV DESCRIPTION — Service code description: AI (4320)

  // 7-series (sector/country-specific)
  '7002': 30, // MEAT CUT — UNECE meat carcases & cuts classification: AI (7002)
  '7004': 4,  // ACTIVE POTENCY (N..4): AI (7004)
  '7005': 12, // CATCH AREA (X..12): AI (7005)
  '7007': 12, // HARVEST DATE (N6..12): AI (7007)
  '7008': 3,  // AQUATIC SPECIES (X..3): AI (7008)
  '7009': 10, // FISHING GEAR TYPE (X..10): AI (7009)
  '7010': 2,  // PROD METHOD (X..2): AI (7010)
  '7020': 20, // REFURB LOT (X..20): AI (7020)
  '7021': 20, // FUNC STAT (X..20): AI (7021)
  '7022': 20, // REV STAT (X..20): AI (7022)
  '7023': 30, // GIAI – ASSEMBLY (X..30): AI (7023)
  '703s': 30, // PROCESSOR # (N3+X..27): AI (703s)

  // NHRN (country-specific reimbursement numbers)
  '710': 20,  // NHRN PZN (X..20): AI (710)
  '711': 20,  // NHRN CIP (X..20): AI (711)
  '712': 20,  // NHRN CN (X..20): AI (712)
  '713': 20,  // NHRN DRN (X..20): AI (713)
  '714': 20,  // NHRN AIM (X..20): AI (714)
  '723s': 30, // CERT # s — Certification reference (X2+X..28): AI (723s)
  '7240': 20, // PROTOCOL (X..20): AI (7240)

  // 8-series misc.
  '8002': 20, // CMI — Cellular mobile telephone identifier (X..20): AI (8002)
  '8003': 30, // GRAI — Global Returnable Asset Identifier (N14+X..16): AI (8003)
  '8004': 30, // GIAI — Global Individual Asset Identifier (X..30): AI (8004)
  '8007': 34, // IBAN — International Bank Account Number (X..34): AI (8007)
  '8008': 12, // PROD TIME — Date and time of production (N8+N..4): AI (8008)
  '8009': 50, // OPTSEN — Optically readable sensor indicator (X..50): AI (8009)
  '8010': 30, // CPID — Component/Part Identifier (X..30): AI (8010)
  '8011': 12, // CPID SERIAL (N..12): AI (8011)
  '8012': 20, // VERSION — Software version (X..20): AI (8012)
  '8013': 25, // GMN — Global Model Number (X..25): AI (8013)
  '8019': 10, // SRIN — Service Relation Instance Number (N..10): AI (8019)

  '8020': 25, // REF NO. — Payment slip reference number (X..25): AI (8020)

  '8110': 70, // — Coupon code ID for use in North America (X..70): AI (8110)
  '8112': 70, // — Positive offer file coupon code ID (X..70): AI (8112)
  '8200': 70, // PRODUCT URL — Extended packaging URL (X..70): AI (8200)

  // Internal / mutually agreed
  '90': 30,   // INTERNAL — Information mutually agreed between trading partners (X..30): AI (90)
  '91-99': 90 // INTERNAL — Company internal information (X..90): AIs (91–99)
};

