// Utility functions for parsing Excel files
export interface CompanyData {
  companyName: string
  hrEmail: string
  recipientName?: string
}

export async function parseExcelFile(file: File): Promise<CompanyData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const data = e.target?.result as ArrayBuffer

        // Handle CSV files
        if (file.name.endsWith(".csv")) {
          const text = new TextDecoder().decode(data)
          const lines = text.split("\n")
          const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

          const companyNameIndex = headers.findIndex((h) => h.includes("company") || h.includes("name"))
          const emailIndex = headers.findIndex((h) => h.includes("email") || h.includes("hr"))
          const recipientNameIndex = headers.findIndex((h) => h.includes("recipient") || h.includes("contact") || h.includes("person"))

          if (companyNameIndex === -1 || emailIndex === -1) {
            reject(new Error("Could not find company name or email columns"))
            return
          }

          const companies: CompanyData[] = []

          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map((v) => v.trim())
            if (
              values.length > Math.max(companyNameIndex, emailIndex) &&
              values[companyNameIndex] &&
              values[emailIndex]
            ) {
              companies.push({
                companyName: values[companyNameIndex],
                hrEmail: values[emailIndex],
                recipientName: recipientNameIndex !== -1 && values[recipientNameIndex] ? values[recipientNameIndex] : undefined,
              })
            }
          }

          resolve(companies)
        } else {
          // Handle Excel files using dynamic import
          try {
            const XLSX = await import("xlsx")
            const workbook = XLSX.read(new Uint8Array(data), { type: "array" })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]

            if (jsonData.length < 2) {
              reject(new Error("Excel file must have at least a header row and one data row"))
              return
            }

            const headers = jsonData[0].map((h) => h?.toString().toLowerCase() || "")
            const companyNameIndex = headers.findIndex((h) => h.includes("company") || h.includes("name"))
            const emailIndex = headers.findIndex((h) => h.includes("email") || h.includes("hr"))
            const recipientNameIndex = headers.findIndex((h) => h.includes("recipient") || h.includes("contact") || h.includes("person"))

            if (companyNameIndex === -1 || emailIndex === -1) {
              reject(
                new Error(
                  "Could not find company name or email columns. Please ensure your Excel file has columns containing 'company'/'name' and 'email'/'hr'",
                ),
              )
              return
            }

            const companies: CompanyData[] = []

            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i]
              if (row && row[companyNameIndex] && row[emailIndex]) {
                companies.push({
                  companyName: row[companyNameIndex].toString().trim(),
                  hrEmail: row[emailIndex].toString().trim(),
                  recipientName: recipientNameIndex !== -1 && row[recipientNameIndex] ? row[recipientNameIndex].toString().trim() : undefined,
                })
              }
            }

            console.log(
              `[v0] Parsed ${companies.length} companies from Excel file:`,
              companies.map((c) => c.companyName),
            )
            resolve(companies)
          } catch (xlsxError) {
            console.error("[v0] Error parsing Excel file:", xlsxError)
            reject(new Error("Failed to parse Excel file. Please ensure it's a valid .xlsx or .xls file"))
          }
        }
      } catch (error) {
        console.error("[v0] Error reading file:", error)
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsArrayBuffer(file)
  })
}

export async function extractResumeText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      // In a real implementation, you would use libraries like:
      // - pdf-parse for PDF files
      // - mammoth for Word documents
      // For now, return mock resume text
      const mockResumeText = `John Doe
Software Developer
Email: john.doe@email.com | Phone: +1-234-567-8900

PROFESSIONAL SUMMARY:
Experienced Java Developer with 3+ years of expertise in building scalable web applications using Spring Boot, REST APIs, and microservices architecture.

TECHNICAL SKILLS:
• Programming Languages: Java, JavaScript, Python
• Frameworks: Spring Boot, Spring MVC, Spring Security
• Databases: MySQL, PostgreSQL, MongoDB
• Tools: Git, Maven, Docker, Jenkins
• Cloud: AWS, Azure basics

PROFESSIONAL EXPERIENCE:
Software Developer | Tech Solutions Inc. | 2022 - Present
• Developed and maintained REST APIs using Spring Boot
• Built microservices architecture serving 10,000+ daily users
• Optimized database queries reducing response time by 40%
• Collaborated with cross-functional teams using Agile methodology

Junior Developer | StartupCorp | 2021 - 2022
• Created web applications using Java and Spring framework
• Implemented authentication and authorization systems
• Worked with MySQL databases and wrote complex queries

EDUCATION:
Bachelor of Technology in Computer Science
XYZ University | 2021

PROJECTS:
E-commerce Platform: Built a full-stack e-commerce application using Spring Boot and React
Task Management System: Developed REST APIs for a project management tool`

      resolve(mockResumeText)
    }

    reader.onerror = () => reject(new Error("Failed to read resume file"))
    reader.readAsArrayBuffer(file)
  })
}
