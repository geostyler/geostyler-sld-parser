<?xml version="1.0" encoding="UTF-8"?>
<sld:StyledLayerDescriptor xmlns:sld="http://www.opengis.net/sld" xmlns="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0">
   <sld:NamedLayer>
      <sld:Name>Industrielle Einleiter</sld:Name>
      <sld:UserStyle>
         <sld:Name>Default Styler</sld:Name>
         <sld:Title />
         <sld:FeatureTypeStyle>
            <sld:Name>name</sld:Name>
            <sld:Rule>
               <sld:Name>keinIVU</sld:Name>
               <sld:Title>kein IVU-Betrieb</sld:Title>
               <ogc:Filter>
                  <ogc:PropertyIsNull>
                     <ogc:PropertyName>ARBEITSSTAETTEN_NR</ogc:PropertyName>
                  </ogc:PropertyIsNull>
               </ogc:Filter>
               <sld:MaxScaleDenominator>150000.0</sld:MaxScaleDenominator>
               <sld:PointSymbolizer>
                  <sld:Graphic>
                     <sld:Mark>
                        <sld:WellKnownName>circle</sld:WellKnownName>
                        <sld:Fill>
                           <sld:CssParameter name="fill">#FFC000</sld:CssParameter>
                        </sld:Fill>
                        <sld:Stroke>
                           <sld:CssParameter name="stroke">#001C90</sld:CssParameter>
                        </sld:Stroke>
                     </sld:Mark>
                     <sld:Size>10</sld:Size>
                  </sld:Graphic>
               </sld:PointSymbolizer>
            </sld:Rule>
            <sld:Rule>
               <sld:Name>IVU</sld:Name>
               <sld:Title>IVU Betrieb</sld:Title>
               <ogc:Filter>
                  <ogc:Not>
                     <ogc:PropertyIsNull>
                        <ogc:PropertyName>ARBEITSSTAETTEN_NR</ogc:PropertyName>
                     </ogc:PropertyIsNull>
                  </ogc:Not>
               </ogc:Filter>
               <sld:MaxScaleDenominator>150000.0</sld:MaxScaleDenominator>
               <sld:PointSymbolizer>
                  <sld:Graphic>
                     <sld:Mark>
                        <sld:WellKnownName>circle</sld:WellKnownName>
                        <sld:Fill>
                           <sld:CssParameter name="fill">#7DDD00</sld:CssParameter>
                        </sld:Fill>
                        <sld:Stroke>
                           <sld:CssParameter name="stroke">#001C90</sld:CssParameter>
                        </sld:Stroke>
                     </sld:Mark>
                     <sld:Size>10</sld:Size>
                  </sld:Graphic>
               </sld:PointSymbolizer>
            </sld:Rule>
            <sld:Rule>
               <sld:Name>keinIVU</sld:Name>
               <sld:Title>kein IVU-Betrieb</sld:Title>
               <ogc:Filter>
                  <ogc:PropertyIsNull>
                     <ogc:PropertyName>ARBEITSSTAETTEN_NR</ogc:PropertyName>
                  </ogc:PropertyIsNull>
               </ogc:Filter>
               <sld:MinScaleDenominator>150000.0</sld:MinScaleDenominator>
               <sld:MaxScaleDenominator>500000.0</sld:MaxScaleDenominator>
               <sld:PointSymbolizer>
                  <sld:Graphic>
                     <sld:Mark>
                        <sld:WellKnownName>circle</sld:WellKnownName>
                        <sld:Fill>
                           <sld:CssParameter name="fill">#FFC000</sld:CssParameter>
                        </sld:Fill>
                        <sld:Stroke>
                           <sld:CssParameter name="stroke">#001C90</sld:CssParameter>
                        </sld:Stroke>
                     </sld:Mark>
                     <sld:Size>8</sld:Size>
                  </sld:Graphic>
               </sld:PointSymbolizer>
            </sld:Rule>
            <sld:Rule>
               <sld:Name>IVU</sld:Name>
               <sld:Title>IVU Betrieb</sld:Title>
               <ogc:Filter>
                  <ogc:Not>
                     <ogc:PropertyIsNull>
                        <ogc:PropertyName>ARBEITSSTAETTEN_NR</ogc:PropertyName>
                     </ogc:PropertyIsNull>
                  </ogc:Not>
               </ogc:Filter>
               <sld:MinScaleDenominator>150000.0</sld:MinScaleDenominator>
               <sld:MaxScaleDenominator>500000.0</sld:MaxScaleDenominator>
               <sld:PointSymbolizer>
                  <sld:Graphic>
                     <sld:Mark>
                        <sld:WellKnownName>circle</sld:WellKnownName>
                        <sld:Fill>
                           <sld:CssParameter name="fill">#7DDD00</sld:CssParameter>
                        </sld:Fill>
                        <sld:Stroke>
                           <sld:CssParameter name="stroke">#001C90</sld:CssParameter>
                        </sld:Stroke>
                     </sld:Mark>
                     <sld:Size>8</sld:Size>
                  </sld:Graphic>
               </sld:PointSymbolizer>
            </sld:Rule>
            <sld:Rule>
               <sld:Name>keinIVU</sld:Name>
               <sld:Title>kein IVU-Betrieb</sld:Title>
               <ogc:Filter>
                  <ogc:PropertyIsNull>
                     <ogc:PropertyName>ARBEITSSTAETTEN_NR</ogc:PropertyName>
                  </ogc:PropertyIsNull>
               </ogc:Filter>
               <sld:MinScaleDenominator>500000.0</sld:MinScaleDenominator>
               <sld:MaxScaleDenominator>1.0E12</sld:MaxScaleDenominator>
               <sld:PointSymbolizer>
                  <sld:Graphic>
                     <sld:Mark>
                        <sld:WellKnownName>circle</sld:WellKnownName>
                        <sld:Fill>
                           <sld:CssParameter name="fill">#FFC000</sld:CssParameter>
                        </sld:Fill>
                        <sld:Stroke>
                           <sld:CssParameter name="stroke">#001C90</sld:CssParameter>
                        </sld:Stroke>
                     </sld:Mark>
                     <sld:Size>6</sld:Size>
                  </sld:Graphic>
               </sld:PointSymbolizer>
            </sld:Rule>
            <sld:Rule>
               <sld:Name>IVU</sld:Name>
               <sld:Title>IVU Betrieb</sld:Title>
               <ogc:Filter>
                  <ogc:Not>
                     <ogc:PropertyIsNull>
                        <ogc:PropertyName>ARBEITSSTAETTEN_NR</ogc:PropertyName>
                     </ogc:PropertyIsNull>
                  </ogc:Not>
               </ogc:Filter>
               <sld:MinScaleDenominator>500000.0</sld:MinScaleDenominator>
               <sld:MaxScaleDenominator>1.0E12</sld:MaxScaleDenominator>
               <sld:PointSymbolizer>
                  <sld:Graphic>
                     <sld:Mark>
                        <sld:WellKnownName>circle</sld:WellKnownName>
                        <sld:Fill>
                           <sld:CssParameter name="fill">#7DDD00</sld:CssParameter>
                        </sld:Fill>
                        <sld:Stroke>
                           <sld:CssParameter name="stroke">#001C90</sld:CssParameter>
                        </sld:Stroke>
                     </sld:Mark>
                     <sld:Size>6</sld:Size>
                  </sld:Graphic>
               </sld:PointSymbolizer>
            </sld:Rule>
         </sld:FeatureTypeStyle>
      </sld:UserStyle>
   </sld:NamedLayer>
</sld:StyledLayerDescriptor>
