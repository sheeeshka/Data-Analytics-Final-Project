import tkinter as tk
from tkinter import filedialog, ttk, messagebox
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import threading

# Function to upload a CSV file
def upload_file():
    global df
    file_path = filedialog.askopenfilename(filetypes=[("CSV files", "*.csv")])
    if file_path:
        try:
            df = pd.read_csv(file_path)
            label_file_path.config(text=f"File Uploaded: {file_path}")
            update_column_dropdowns()
        except Exception as e:
            messagebox.showerror("Error", f"Error reading file: {e}")

# Function to update the column dropdowns
def update_column_dropdowns():
    if df is not None:
        columns = list(df.columns)
        # Update dropdown_x with the column names
        dropdown_x['values'] = columns
        dropdown_y['values'] = columns

# Function to generate the chosen visualization
def generate_chart():
    if df is not None:
        x_col = column_var_x.get()
        y_col = column_var_y.get()
        chart_type = chart_type_var.get()
        title = entry_title.get()

        if x_col and y_col and chart_type:
            # Clear the current plot
            for widget in frame_left.winfo_children():
                if isinstance(widget, tk.Canvas):
                    widget.destroy()

            # Scatter plot handling for large data
            if chart_type == "Scatter Plot":
                # Limit the data for large datasets
                sample_size = 1000  # Limit the scatter plot to 1000 points for performance
                if len(df) > sample_size:
                    df_sample = df.sample(n=sample_size, random_state=42)
                else:
                    df_sample = df

                x_col_values = pd.to_numeric(df_sample[x_col], errors='coerce')
                y_col_values = pd.to_numeric(df_sample[y_col], errors='coerce')

                # Remove any rows with invalid data for scatter plot
                df_sample = df_sample[x_col_values.notna() & y_col_values.notna()]

            else:
                df_sample = df  # For other chart types, we don't need to sample

            # Proceed with plotting
            plt.figure(figsize=(10, 6))
            ax = plt.gca()  # Get current axis for custom plotting

            if chart_type == "Bar Chart":
                df_sample.plot(kind='bar', x=x_col, y=y_col, title=title, ax=ax)
            elif chart_type == "Line Chart":
                df_sample.plot(kind='line', x=x_col, y=y_col, title=title, ax=ax)
            elif chart_type == "Pie Chart":
                df_sample[y_col].value_counts().plot(kind='pie', autopct='%1.1f%%', title=title, ax=ax)
            elif chart_type == "Histogram":
                df_sample[y_col].plot(kind='hist', bins=20, edgecolor='black', title=title, ax=ax)
            elif chart_type == "Scatter Plot":
                df_sample.plot(kind='scatter', x=x_col, y=y_col, title=title, ax=ax)

            ax.set_xlabel(x_col)
            ax.set_ylabel(y_col)
            ax.set_title(title)

            # Create the canvas for Matplotlib figure and place it inside Tkinter
            canvas = FigureCanvasTkAgg(plt.gcf(), master=frame_left)
            canvas.draw()
            canvas.get_tk_widget().grid(row=1, column=0, pady=20)

            plt.close()  # Close the figure to avoid it being displayed twice

# Function to clean the CSV (e.g., drop null values, remove duplicates)
def clean_csv():
    if df is not None:
        # Show a progress indicator to the user
        label_progress.config(text="Cleaning in progress... Please wait.")
        root.update()  # Force Tkinter to refresh the UI

        # Perform the cleaning in a background thread to keep the UI responsive
        thread = threading.Thread(target=apply_cleaning)
        thread.start()

def apply_cleaning():
    global df
    if df is not None:
        # Remove null values or duplicates based on user choices
        if var_drop_na.get():
            df.dropna(inplace=True)
        if var_remove_duplicates.get():
            df.drop_duplicates(inplace=True)

        # Update the display of the cleaned dataframe in the text widget
        update_dataframe_display()

        # Notify the user about the changes
        label_progress.config(text="Cleaning complete!")
        messagebox.showinfo("Cleaned", "CSV cleaned successfully!")

# Function to update the display of the DataFrame in the text widget
def update_dataframe_display():
    if df is not None:
        text_display.delete(1.0, tk.END)  # Clear previous content
        text_display.insert(tk.END, df.head().to_string())  # Display first few rows

# Initialize the main tkinter window
root = tk.Tk()
root.title("Vizionary")
root.geometry("1000x700")
root.configure(bg="#f4f4f9")

df = None  # Placeholder for the loaded DataFrame

# Creating Tabs
notebook = ttk.Notebook(root)
notebook.pack(fill="both", expand=True, padx=20, pady=20)

# Visualization Tab
frame_visualization = ttk.Frame(notebook)
notebook.add(frame_visualization, text="Visualization")

# Left panel for visualization
frame_left = ttk.Frame(frame_visualization, padding=20)
frame_left.grid(row=0, column=0, sticky="nsew")

label_visualization = ttk.Label(frame_left, text="Create a Chart", font=("Helvetica", 14))
label_visualization.grid(row=0, column=0, pady=10)

label_title = ttk.Label(frame_left, text="Title/Label:")
label_title.grid(row=2, column=0, pady=5, sticky="w")
entry_title = ttk.Entry(frame_left, width=40)
entry_title.grid(row=3, column=0, pady=5)

button_generate_pdf = ttk.Button(frame_left, text="Generate PDF", style="TButton")
button_generate_pdf.grid(row=4, column=0, pady=20)

# Right panel for file upload and options
frame_right = ttk.Frame(frame_visualization, padding=20)
frame_right.grid(row=0, column=1, sticky="nsew")

label_file_path = ttk.Label(frame_right, text="CSV File:", font=("Helvetica", 12))
label_file_path.grid(row=0, column=0, pady=10)

button_upload = ttk.Button(frame_right, text="Browse Files", command=upload_file)
button_upload.grid(row=1, column=0, pady=10)

column_var_x = tk.StringVar()
dropdown_x = ttk.Combobox(frame_right, textvariable=column_var_x, state="readonly", width=20)
dropdown_x.grid(row=2, column=0, pady=5)

column_var_y = tk.StringVar()
dropdown_y = ttk.Combobox(frame_right, textvariable=column_var_y, state="readonly", width=20)
dropdown_y.grid(row=3, column=0, pady=5)

# Chart type options
label_chart_type = ttk.Label(frame_right, text="Chart Type:")
label_chart_type.grid(row=4, column=0, pady=5)

chart_type_var = tk.StringVar(value="Bar Chart")
chart_types = ["Bar Chart", "Line Chart", "Pie Chart", "Histogram", "Scatter Plot"]

for idx, chart in enumerate(chart_types):
    radio_button = ttk.Radiobutton(frame_right, text=chart, variable=chart_type_var, value=chart)
    radio_button.grid(row=5+idx, column=0, sticky="w", padx=20)

button_generate_chart = ttk.Button(frame_right, text="Generate Chart", command=generate_chart)
button_generate_chart.grid(row=10, column=0, pady=20)

# CSV Cleaning Tab
frame_cleaning = ttk.Frame(notebook)
notebook.add(frame_cleaning, text="CSV Cleaning")

# Frame for cleaning options
frame_cleaning_options = ttk.Frame(frame_cleaning, padding=20)
frame_cleaning_options.grid(row=0, column=0, sticky="nsew")

var_drop_na = tk.BooleanVar()
check_drop_na = ttk.Checkbutton(frame_cleaning_options, text="Drop rows with missing values", variable=var_drop_na)
check_drop_na.grid(row=0, column=0, sticky="w", pady=5)

var_remove_duplicates = tk.BooleanVar()
check_remove_duplicates = ttk.Checkbutton(frame_cleaning_options, text="Remove duplicate rows", variable=var_remove_duplicates)
check_remove_duplicates.grid(row=1, column=0, sticky="w", pady=5)

button_clean_csv = ttk.Button(frame_cleaning_options, text="Clean CSV", command=clean_csv)
button_clean_csv.grid(row=2, column=0, pady=10)

# Display the DataFrame in a text widget (top part of the cleaning tab)
text_display = tk.Text(frame_cleaning, width=80, height=20, wrap="none")
text_display.grid(row=1, column=0, padx=20, pady=10)

# Progress label for cleaning process
label_progress = ttk.Label(frame_cleaning_options, text="")
label_progress.grid(row=3, column=0, pady=10)

root.mainloop()
