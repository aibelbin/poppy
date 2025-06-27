from markdown_pdf import MarkdownPdf
from markdown_pdf import Section
import io 

def genPdf(markdown, filename):

    pdf = MarkdownPdf(toc_level = 1)  #verify later
    
    pdf.meta["title"] = "Diaganosis"
    pdf.meta["author"] = "Ai agent"

    
    pdf.add_section(Section(markdown))

    content = pdf.save(filename)
    

    
    return content




