const ROADMAP = {
  layers: [
    {id:"finance", name:"Finance & Investment", icon:"01", desc:"Markets, corporate finance, valuation and portfolio thinking."},
    {id:"risk", name:"Risk Specialization", icon:"02", desc:"Credit, market, liquidity, operational and model risk."},
    {id:"quant", name:"Quantitative Analytics", icon:"03", desc:"Probability, statistics, time series, simulation and modelling."},
    {id:"data", name:"Data Science", icon:"04", desc:"Python/R analytics, ML, experimentation and explainability."},
    {id:"engineering", name:"Data Engineering", icon:"05", desc:"Pipelines, warehouses, orchestration, Spark and production data."},
    {id:"ai", name:"AI / ML / Cloud", icon:"06", desc:"AI systems, cloud deployment and intelligent financial workflows."}
  ],
  phases: [
    {
      id:"y31", title:"Year 3.1 — Foundation", period:"NOW", status:"current",
      objective:"Build the quantitative, programming and financial foundation before going deep into infrastructure.",
      skills:["Python","SQL","R","Probability & Statistics","Financial Foundations","Git/GitHub","Excel","Data Cleaning"],
      projects:["Financial Data Analysis"],
      outcomes:["Clean and analyze a messy financial dataset","Write intermediate SQL independently","Explain core financial/risk concepts mathematically"]
    },
    {
      id:"y32", title:"Year 3.2 — Quantitative Analytics", period:"NEXT", status:"next",
      objective:"Connect finance and risk theory to statistical modelling, machine learning and data engineering.",
      skills:["Time Series","Credit Risk","Market Risk","Machine Learning","Portfolio Analytics","PostgreSQL","ETL/ELT","APIs","Airflow"],
      projects:["Portfolio Risk Engine","Credit Risk Model","Insurance Risk Model","Financial Data Pipeline"],
      outcomes:["Build and validate risk models","Create reproducible pipelines","Explain model results to non-technical stakeholders"]
    },
    {
      id:"y41", title:"Year 4.1 — Cloud & Production", period:"LATER", status:"future",
      objective:"Move from notebooks to production-grade financial/risk systems.",
      skills:["AWS","Docker","REST APIs","Testing","Logging","CI/CD","Spark","Data Warehouses","Model Monitoring"],
      projects:["Production Financial Data Platform"],
      outcomes:["Deploy a working analytics system","Use cloud data services","Build reliable and documented software"]
    },
    {
      id:"y42", title:"Year 4.2 — AI & Job Readiness", period:"FINAL", status:"future",
      objective:"Combine risk expertise, engineering and AI into a distinctive graduate profile.",
      skills:["LLM APIs","RAG","AI Agents","AI Evaluation","Explainable AI","AI Governance","Financial AI"],
      projects:["Financial Risk Intelligence Platform"],
      outcomes:["Ship a flagship portfolio system","Pass SQL/statistics/case interviews","Demonstrate responsible AI usage"]
    }
  ],
  categories: [
    {id:"core", name:"Core Quant & Finance", color:"", skills:[
      ["Probability","Quantitative foundation",85],["Statistics","Inference and modelling",80],["Financial Mathematics","Actuarial/finance foundation",75],
      ["Actuarial Mathematics","Life, risk and contingency mathematics",65],["Financial Markets","Markets and instruments",55],["Corporate Finance","Statements, valuation, capital structure",45],["Investment Theory","Portfolio theory, CAPM, allocation",50],
      ["Risk Management","Risk identification, measurement and controls",35],["Financial Modelling","Turn assumptions into auditable financial models",30],["Data Analysis","Turn messy data into decision-ready insight",35]
    ]},
    {id:"risk", name:"Risk Specialization", skills:[
      ["Credit Risk","PD, LGD, EAD, expected loss",30],["Market Risk","VaR, ES, stress testing",25],["Liquidity Risk","Funding and cash-flow risk",20],
      ["Operational Risk","Controls, loss events, KRIs",20],["Model Risk","Validation, calibration, backtesting",15]
    ]},
    {id:"technical", name:"Technical Stack", skills:[
      ["Python","Production-capable analytical programming",35],["SQL","Queries, CTEs, windows, optimization",40],["R","Statistical and actuarial analysis",50],
      ["Excel","Advanced analysis and modelling",55],["Git/GitHub","Version control and portfolio",30],["Power BI","Decision-focused dashboards",20],
      ["PostgreSQL","Relational data and optimization",15],["APIs","Data ingestion and services",10],["Testing","Reliable automated checks",0],["Debugging","Diagnose failures systematically",0],
      ["Linux","Command line and runtime fundamentals",0],["REST APIs","Design and consume services",0],["Clean Code","Readable, maintainable software",0],["Documentation","Explain systems for their next user",0],["Security Basics","Protect data, credentials and services",0]
    ]},
    {id:"ml", name:"Machine Learning", skills:[
      ["Regression","Linear/logistic modelling",15],["Tree Models","Trees, random forest, boosting",10],["XGBoost","Risk classification",5],
      ["Feature Engineering","Useful predictive variables",5],["Model Evaluation","CV, metrics, calibration",5],["SHAP","Model explainability",0],
      ["Time Series","Forecasting and volatility",10]
    ]},
    {id:"engineering", name:"Data Engineering & Cloud", skills:[
      ["ETL / ELT","Reliable data movement",0],["Data Warehousing","Analytics-ready architecture",0],["Data Modelling","Design useful analytical schemas",0],["Airflow","Workflow orchestration",0],
      ["Spark","Distributed processing",0],["Kafka","Streaming foundations",0],["AWS","S3, IAM, RDS, Glue, Athena, Redshift",0],
      ["Docker","Containerization",0],["CI/CD","Automated delivery",0],["Model Monitoring","Track drift, quality and performance",0]
    ]},
    {id:"ai", name:"AI for Financial/Risk Systems", skills:[
      ["LLM APIs","Integrate models into applications",0],["RAG","Evidence-grounded retrieval",0],["AI Agents","Tool-using workflows",0],
      ["AI Evaluation","Reliability and quality testing",0],["Responsible AI","Governance and controls",0],["AI Governance","Risk, privacy and oversight",0]
    ]}
  ],
  projects: [
    {id:"p1", name:"Financial Data Analysis", phase:"Year 3.1", stack:"Python · SQL · Power BI", level:"Foundation", status:"not-started",
     brief:"Analyze Kenyan financial/banking/market data and produce decision-ready insights.",
     deliverables:["Clean dataset + data dictionary","SQL analysis","Python notebook","4–6 meaningful visualizations","Power BI dashboard","Executive recommendation"]},
    {id:"p2", name:"Portfolio Risk Engine", phase:"Year 3.2", stack:"Python · SQL", level:"Intermediate", status:"not-started",
     brief:"Calculate portfolio returns and risk measures and explain their meaning.",
     deliverables:["Returns and volatility","Sharpe ratio","Correlation matrix","VaR + Expected Shortfall","Maximum drawdown","Portfolio optimization"]},
    {id:"p3", name:"Credit Risk Model", phase:"Year 3.2", stack:"Python · SQL · ML", level:"Advanced", status:"not-started",
     brief:"Predict probability of default and translate model output into risk decisions.",
     deliverables:["Data pipeline","Logistic regression baseline","XGBoost model","Calibration/evaluation","SHAP explanation","Risk scorecard"]},
    {id:"p4", name:"Insurance Risk Model", phase:"Year 3.2", stack:"Python/R · GLM · ML", level:"Advanced", status:"not-started",
     brief:"Model claim frequency and severity using actuarial and machine-learning approaches.",
     deliverables:["EDA","GLM frequency model","Severity model","Simulation","ML comparison","Business interpretation"]},
    {id:"p5", name:"Financial Data Pipeline", phase:"Year 3.2–4.1", stack:"Python · SQL · Airflow · Spark · AWS · Docker", level:"Advanced", status:"not-started",
     brief:"Build a production-style pipeline from APIs to an analytics warehouse.",
     deliverables:["API ingestion","Raw storage","ETL/ELT","Orchestration","Data warehouse","Monitoring"]},
    {id:"p6", name:"Financial Risk Intelligence Platform", phase:"Year 4.2", stack:"Python · SQL · AWS · ML · RAG · LLM", level:"Signature", status:"not-started",
     brief:"A flagship system combining data engineering, quantitative risk, ML and evidence-grounded AI.",
     deliverables:["Financial data ingestion","Risk analytics","ML risk models","AI research assistant","Evidence citations","Dashboard/API","Model monitoring"]}
  ],
  interview: [
    {q:"SQL", text:"Given customers and orders tables, write a query to find the top 5 customers by total spending.", skill:"SQL"},
    {q:"Statistics", text:"A new credit model has a p-value of 0.03. What does that mean, and what does it NOT mean?", skill:"Statistics"},
    {q:"Risk", text:"A bank's motor-loan defaults increased 25%. Walk through your investigation before recommending an action.", skill:"Risk Analysis"},
    {q:"Finance", text:"Explain diversification, CAPM and the Sharpe ratio to an investment committee.", skill:"Investment Theory"},
    {q:"ML", text:"Your default dataset has 95% non-defaults and 5% defaults. Why is accuracy misleading and what would you use instead?", skill:"Machine Learning"},
    {q:"Engineering", text:"Design a pipeline that ingests daily financial data, validates it, stores it and makes it available for risk models.", skill:"Data Engineering"},
    {q:"AI", text:"How would you build an AI financial research assistant while preventing unsupported investment claims?", skill:"Responsible AI"},
    {q:"Case", text:"Revenue increased 15%, customers 2%, orders 3%, average order value 12%, but profit fell 8%. What could be happening?", skill:"Business Reasoning"}
  ]
};