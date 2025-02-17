import subprocess
import os

def DocxToPdf(docx_path):
    pdf_output_path = docx_path.replace('.docx', '.pdf')
    
    try:
        if not os.path.exists(docx_path):
            raise FileNotFoundError(f"Файл {docx_path} не найден.")

        result = subprocess.run([
            'soffice', '--headless', '--convert-to', 'pdf',
            '--outdir', os.path.dirname(docx_path), docx_path
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        if result.returncode != 0:
            raise Exception(f"Ошибка конвертации: {result.stderr.decode('utf-8')}")

        if os.path.exists(pdf_output_path):
            print(f"PDF файл успешно создан: {pdf_output_path}")
            return pdf_output_path
        else:
            raise FileNotFoundError("Ошибка конвертации PDF, файл не был создан.")
    
    except Exception as e:
        print(f"Ошибка: {e}")
        raise
    
    finally:
        print("Процесс конвертации завершён.")
